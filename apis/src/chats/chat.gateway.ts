import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from './chats.service';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatsService: ChatsService) {}
  // listen for send_message events
  async handleConnection(socket: Socket) {
    await this.chatsService.getUserFromSocket(socket);
  }
  @SubscribeMessage('send_message')
  async listenForMessages(
    @MessageBody() message: string,
    @ConnectedSocket() socket: Socket,
    ) {
      const author = await this.chatsService.getUserFromSocket(socket);
      const resp = { message: 'WELCOME' };
      this.server.sockets.emit('receive_message', {
        message,
        author
      });
  }

}
