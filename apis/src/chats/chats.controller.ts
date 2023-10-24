import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { MessageDto } from './dto/message.dto';

@Controller('pong/chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  async findAllMessages() {
    return this.chatsService.findAllMessages();
  }

  @Post()
  async sendMessages(@Body() message: MessageDto) {
    return this.chatsService.saveMessage(message);
  }
}
