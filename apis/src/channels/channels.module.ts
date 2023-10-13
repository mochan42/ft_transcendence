import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelsService } from './channels.service';
import { Channel } from './entities/channel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Channel])],
  providers: [ChannelsService],
  exports: [ChannelsService],
})
export class ChannelsModule {}
