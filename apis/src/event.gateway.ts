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

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
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
  ) {}

  async handleConnection(@ConnectedSocket() socket: Socket, ...args: any[]) {
    const user = await this.chatsService.getUserFromSocket(socket);

    this.server.emit('message', `Welcome ${user.userName}, you're connected`);
  }

  async handleDisconnect(socket: Socket) {
    const user = await this.chatsService.getUserFromSocket(socket);
    return await this.userService.updateLoginState(+user.id, false);
  }

  @SubscribeMessage('invite_friend')
  async createFriendship(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: string,
  ) {
    const user = await this.chatsService.getUserFromSocket(socket);
    const friendDto: CreateFriendDto = {
      receiver: +payload,
      sender: user.id,
      relation: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    const friendShip = await this.friendsService.create(friendDto);

    this.server.emit('invite_friend_success', friendShip);
  }

  @SubscribeMessage('accept_friend_request')
  async updateFriendship(
    @ConnectedSocket() socket: Socket,
    @MessageBody() friendship: CreateFriendDto,
  ) {
    var updatedFriendship;
    const user = await this.chatsService.getUserFromSocket(socket);

    if (friendship.receiver === user.id) {
      const reqToAccept: CreateFriendDto = {
        ...friendship,
        relation: 'ACCEPTED', // should define enum values for relation !!!!
      };

      updatedFriendship = await this.friendsService.update(
        user.id,
        reqToAccept,
      );
    }

    this.server.emit('accepted_friend_request', updatedFriendship);
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

    socket.emit('channel_created', newChannel);
  }
}
