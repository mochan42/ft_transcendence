import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ChannelsService } from '../channels.service';
import { JoinchannelService } from 'src/joinchannel/joinchannel/joinchannel.service';

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
