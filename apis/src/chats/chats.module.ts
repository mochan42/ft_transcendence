import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import User from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [UsersModule],
  controllers: [ChatsController],
  providers: [ChatsService]
})
export class ChatsModule {}
