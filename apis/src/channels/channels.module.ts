import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelsService } from './channels.service';
import { Channel } from './entities/channel.entity';
import { ChannelsController } from './channels/channels.controller';
import { JoinchannelModule } from 'src/joinchannel/joinchannel.module';

@Module({
  imports: [TypeOrmModule.forFeature([Channel]), JoinchannelModule],
  controllers: [ChannelsController],
  providers: [ChannelsService],
  exports: [ChannelsService],
})
export class ChannelsModule {}
