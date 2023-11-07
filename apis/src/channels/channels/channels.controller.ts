import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ChannelsService } from '../channels.service';
import { JoinchannelService } from 'src/joinchannel/joinchannel/joinchannel.service';
import { CreateChannelDto } from '../dto/create-channel.dto';

@Controller()
export class ChannelsController {
  constructor(
    private channelsService: ChannelsService,
    private joinChannelService: JoinchannelService,
  ) {}

  @Get('pong/channels')
  async findAll() {
    return this.channelsService.findAll();
  }

  @Post('pong/channels')
  async createGroup(@Body()group: CreateChannelDto) {
    return this.channelsService.create(group);
  }

  @Delete('pong/channels/:id')
  async delete(@Param('id') id: string) {
    return this.channelsService.remove(+id);
  }

  @Get('pong/channels/members')
  async findAllMembers() {
    return this.joinChannelService.findAll();
  }

  @Delete('pong/channels/members/:id')
  async removeMember(@Param('id') id: string) {
    return this.joinChannelService.delete(+id);
  }

  @Delete('pong/chanel-all-members')
  removeAll() {
    return this.joinChannelService.deleteAll();
  }
}
