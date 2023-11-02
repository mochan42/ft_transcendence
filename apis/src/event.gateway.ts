import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { ChatsService } from './chats/chats.service';
import { FriendsService } from './friends/friends.service';
import { CreateFriendDto } from './friends/dto/create-friend.dto';
import { CreateChannelDto } from './channels/dto/create-channel.dto';
import { ChannelsService } from './channels/channels.service';
import { JoinchannelService } from './joinchannel/joinchannel/joinchannel.service';
import { UsersService } from './users/users.service';
import { ACCEPTED, PENDING } from './APIS_CONSTS';
import { GamequeueService } from './gamequeue/gamequeue.service';
import { GamesService } from './games/games.service';
import { CreateGameDto } from './games/dto/create-game.dto';
import { Friend } from './friends/entities/friend.entity';
import { MessageDto } from './chats/dto/message.dto';

@WebSocketGateway({
  cors: {
    origin: 'https://special-dollop-r6jj956gq9xf5r9-3000.app.github.dev',
    credentials: true
  },
})
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly userService: UsersService,
    private readonly chatsService: ChatsService,
    private readonly friendsService: FriendsService,
    private readonly channelsService: ChannelsService,
    private readonly joinchannelService: JoinchannelService,
    private readonly gameQueueService: GamequeueService,
    private readonly gamesService: GamesService,
  ) {}

  async handleConnection(@ConnectedSocket() socket: Socket, ...args: any[]) {
    const user = await this.chatsService.getUserFromSocket(socket);
    socket.emit('connected', `Welcome ${user.userName}, you're connected`);
  }

  async handleDisconnect(socket: Socket) {
    const user = await this.chatsService.getUserFromSocket(socket);
    return await this.userService.updateLoginState(+user.id, false);
  }

  @SubscribeMessage('inviteFriend')
  async createFriendship(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: string,
  ) {
    const user = await this.chatsService.getUserFromSocket(socket);
    const friendDto: CreateFriendDto = {
      receiver: +payload,
      sender: user.id,
      relation: PENDING,
      createdAt: new Date().toISOString(),
    };

    const friendShip = await this.friendsService.create(friendDto);

    socket.emit('inviteFriendSucces', {});
    this.server.emit('invitedByFriend', friendShip.receiver);
  }

  @SubscribeMessage('accept_friend')
  async updateFriendship(
    @ConnectedSocket() socket: Socket,
    @MessageBody() friendship: number,
  ) {
    const reqToAccept = await this.friendsService.findBYId(friendship);
    const updatedFriend: Friend = { ...reqToAccept, relation: ACCEPTED };
    const friend = await this.friendsService.update(updatedFriend);

    this.server.emit('friend', friend);
  }

  @SubscribeMessage('deny_friend')
  async deleteFriend(
    @ConnectedSocket() socket: Socket,
    @MessageBody() friendShip: number,
  ) {
    const isDelete = await this.friendsService.remove(friendShip);
    socket.emit('deniedFriend', isDelete);
  }

  @SubscribeMessage('create_channel')
  async createChannel(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: any,
  ) {
    const user = await this.chatsService.getUserFromSocket(socket);

    const channel: CreateChannelDto = {
      owner: +user.id,
      label: payload.title,
      type: payload.privacy_state,
      password: payload.passwd,
      createdAt: new Date().toISOString(),
    };

    const newChannel = await this.channelsService.create(channel);
    const members = [...payload.members];

    if (members.length && newChannel) {
      const createdAt = new Date().toISOString();

      members.forEach(async (member) => {
        const joinchannelDTo = {
          user: +member,
          channel: newChannel.id,
          status: null,
          createdAt: createdAt,
        };

        await this.joinchannelService.create(joinchannelDTo);
      });
    }

    socket.emit('channel', newChannel);
  }

  @SubscribeMessage('send_message')
  async sendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any,
  ) {
    const newMessage: MessageDto = { ...message };
    const savedMessage = await this.chatsService.saveMessage(newMessage);
    this.server.emit('message_sent', savedMessage);
  }

  /***********************GAME*********************** */
  @SubscribeMessage('requestMatch')
  async handleRequestMatch(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: any,
  ) {
    const player1 = data.player1;
    if (data.player2 > 0) {
      const player2 = data.player2;
      const makeGame = await this.gamesService.makeMatch(+player1, +player2, data.difficulty, data.isBoost);
      if (makeGame) {
        this.server.emit('invitedToMatch', makeGame);
      }

    }
    const opponent = this.gameQueueService.findOpponent(socket);
    if (opponent) {
      const player2 = await this.chatsService.getUserFromSocket(socket);
      const makeGame = await this.gamesService.makeMatch(+player1, +player2, data.difficulty, data.isBoost);

      if (makeGame) {
        socket.emit('matchFound', makeGame);
        opponent.emit('matchFound', makeGame);
      }
    }
  }

}