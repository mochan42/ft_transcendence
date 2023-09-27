import { Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from '../channels/entities/channel.entity';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel) private readonly ChannelRepo: Repository<Channel>,
  ) {}
  create(createChannelDto: CreateChannelDto) {
    return 'This action adds a new channel';
  }

  findAll() {
    return `This action returns all channels`;
  }

  findOne(id: number) {
    return `This action returns a #${id} channel`;
  }

  update(id: number, updateChannelDto: UpdateChannelDto) {
    return `This action updates a #${id} channel`;
  }

  remove(id: number) {
    return `This action removes a #${id} channel`;
  }
}
