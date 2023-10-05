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

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatsService: ChatsService,
    private readonly friendsService: FriendsService,
    private readonly channelsService: ChannelsService
  ) { }
  async handleConnection(@ConnectedSocket() socket: Socket, ...args: any[]) {
    const user = await this.chatsService.getUserFromSocket(socket);

    this.server.emit('message', `Welcome ${user.userName}, you're connected`);
  }

  async handleDisconnect(socket: Socket) {
    const user = await this.chatsService.getUserFromSocket(socket);
    socket.emit('message', `${user.userNameLoc} is deconnected`);
  }
  
  @SubscribeMessage('request_friendship')
  async createFriendship(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: string) {
    const user = await this.chatsService.getUserFromSocket(socket);
    const friendDto: CreateFriendDto = {
      receiver: +payload,
      sender: user.id,
      relation: "PENDING",
      createdAt: new Date().toISOString()
    };
    const friendShip = await this.friendsService.create(friendDto);

    socket.emit('received_friend_request', friendShip);
  }

  @SubscribeMessage('accept_friend_request')
  async updateFriendship(
    @ConnectedSocket() socket: Socket,
    friendship: CreateFriendDto
  ) {

    var updatedFriendship;
    const user = await this.chatsService.getUserFromSocket(socket);

    if (friendship.receiver === user.id) {
      const reqToAccept: CreateFriendDto= {
        ...friendship,
        relation: 'ACCEPTED' // should define enum values for relation !!!!
      }  
      
      updatedFriendship = await this.friendsService.update(user.id, reqToAccept);
    }

    this.server.emit('accepted_friend_request', updatedFriendship);
  }

  @SubscribeMessage('create_channel')
  async createChannel(@ConnectedSocket() socket: Socket, channel: CreateChannelDto) {
    const newChannel = await this.channelsService.create(channel);

    socket.emit('channel_created', newChannel);
  }

}
