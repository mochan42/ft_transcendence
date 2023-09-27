import { Module } from '@nestjs/common';
import { ChannelsService } from './ChannelsService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelsController } from './channels/channels.controller';

@Module({
  imports: [TypeOrmModule.forFeature()],
  providers: [ChannelsService],
  exports: [ChannelsService],
  controllers: [ChannelsController],
})
export class ChannelsModule {}
