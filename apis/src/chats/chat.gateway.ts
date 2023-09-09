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
}
