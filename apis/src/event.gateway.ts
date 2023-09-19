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

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatsService: ChatsService) {}
  async handleConnection(@ConnectedSocket() socket: Socket) {
    const user = await this.chatsService.getUserFromSocket(socket);
    this.server.emit('message', `Welcome ${user.userName}, you're connected`);
  }

  async handleDisconnect(socket: Socket) {
    const user = await this.chatsService.getUserFromSocket(socket);
    socket.emit('message', `${user.userNameLoc} is deconnected`);
  }

  @SubscribeMessage('send_message')
  async listenForMessages(
    @MessageBody() message: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const author = await this.chatsService.getUserFromSocket(socket);
    const content = {
      authorId: author.id,
      channelId: 1,
      message,
    };
    const newMessage = await this.chatsService.saveMessage(content);

    this.server.sockets.emit('receive_message', { newMessage });

    return newMessage;
  }

  @SubscribeMessage('request_all_messages')
  async requestAllMessages(@ConnectedSocket() socket: Socket) {
    await this.chatsService.getUserFromSocket(socket);
    const messages = await this.chatsService.getAllMessagesInChannel(1);

    socket.emit('send_all_messages', messages);
  }

  @SubscribeMessage('create_channel')
  async create_channel(@ConnectedSocket() socket: Socket) {
    
  }
}
