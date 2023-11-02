import { Controller, Get } from '@nestjs/common';
import { ChannelsService } from '../channels.service';

@Controller('pong/channels')
export class ChannelsController {
    constructor(private channelsService: ChannelsService) { }

    @Get()
    async findAll() {
        return this.channelsService.findAll();
    }
}
