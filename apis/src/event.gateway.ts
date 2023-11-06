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
import { Game } from './games/entities/game.entity';

@WebSocketGateway({
  cors: {
<<<<<<< HEAD
    origin: 'http://localhost:3000',
=======
    origin: `${ process.env.FRONTEND_URL }`,
>>>>>>> tmp
    // origin: '*',
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
    const allUser = await this.userService.findAll();
    this.server.emit('connected', {new : user, all: allUser});
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    const user = await this.chatsService.getUserFromSocket(socket);
    const logoutUser = await this.userService.updateLoginState(+user.id, false);
    const allUsers = await this.userService.findAll();
    this.server.emit('logout', { new: logoutUser, all: allUsers });
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
    const friends = await this.friendsService.findAll();

    socket.emit('inviteFriendSucces', friends);
    this.server.emit('invitedByFriend', { new : friendShip.receiver, all: friends});
  }

  @SubscribeMessage('acceptFriend')
  async updateFriendship(
    @ConnectedSocket() socket: Socket,
    @MessageBody() friendship: number,
  ) {
    const reqToAccept = await this.friendsService.findBYId(friendship);
    const updatedFriend: Friend = { ...reqToAccept, relation: ACCEPTED };
    const friend = await this.friendsService.update(updatedFriend);
    const allFriends = await this.friendsService.findAll();
    this.server.emit('newFriend', { new: friend, all: allFriends});
  }

  @SubscribeMessage('denyFriend')
  async deleteFriend(
    @ConnectedSocket() socket: Socket,
    @MessageBody() friendShip: number,
  ) {
    const isDelete = await this.friendsService.remove(friendShip);
    socket.emit('deniedFriend', isDelete);
  }

  @SubscribeMessage('createChannel')
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

    socket.emit('newChannel', newChannel);
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any,
  ) {
    const newMessage: MessageDto = { ...message };
    const savedMessage = await this.chatsService.saveMessage(newMessage);
    const allMessages = await this.chatsService.findAllMessages();
    this.server.emit('receiveMessage', { new: savedMessage, all: allMessages });
  }

  @SubscribeMessage('blockFriend')
  async blockFriend(
    @ConnectedSocket() socket: Socket,
    @MessageBody() friendShip: any
    ) 
  {
    const removeFriend = await this.friendsService.remove(+friendShip);
    const allFriends = await this.friendsService.findAll();
    this.server.emit('BlockedFriendSucces', { new: removeFriend, all: allFriends });
  }

  /***********************GAME*********************** */

  @SubscribeMessage('acceptMatch')
  async handleAcceptMatch(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: Game,
  ) {
    console.log("Game was accepted\n");
    const game = await this.gamesService.acceptMatch(data);
    this.server.emit('matchFound', game);
  }

  @SubscribeMessage('updateMatchClient')
  handleUpdateMatch(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: any,
  ){
    this.server.emit('updateMatch', data);
  }

  @SubscribeMessage('updatePaddle1')
  handleUpdatePaddle1(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: any,
  ){
    this.server.emit('updatePaddle1', data);
  }
  
  @SubscribeMessage('updatePaddle2')
  handleUpdatePaddle2(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: any,
  ){
    this.server.emit('updatePaddle2', data);
  }

  @SubscribeMessage('updateBallX')
  handleUpdateBallX(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: any,
  ){
    this.server.emit('updateBallX', data);
  }

  @SubscribeMessage('updateBallY')
  handleUpdateBallY(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: any,
  ){
    this.server.emit('updateBallY', data);
  }

  @SubscribeMessage('updateBoostX')
  handleUpdateBoostX(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: any,
  ){
    this.server.emit('updateBoostX', data);
  }

  @SubscribeMessage('updateBoostY')
  handleUpdateBoostY(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: any,
  ){
    this.server.emit('updateBoostY', data);
  }



  @SubscribeMessage('requestMatch')
  async handleRequestMatch(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: any,
  ) {
    console.log("requestMatch was received.\n")
    const player1 = data.player1;
    if (data.player2 > 0) {
      const player2 = data.player2;
      const makeGame = await this.gamesService.makeMatch(+player1, +player2, data.difficulty, data.isBoost);
      if (makeGame) {
        this.server.emit('invitedToMatch', makeGame);
        console.log("Broadcasting invitedToMatch\n\n")
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
