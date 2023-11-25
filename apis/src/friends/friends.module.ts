import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { Friend } from './entities/friend.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Block } from '../chats/entities/block.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Friend]),
    TypeOrmModule.forFeature([Block]),
  ],
  controllers: [FriendsController],
  providers: [FriendsService],
  exports: [FriendsService],
})
export class FriendsModule {}
