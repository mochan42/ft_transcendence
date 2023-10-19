import { Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './entities/channel.entity';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private ChannelRepo: Repository<Channel>
  ) {}
  async create(createChannelDto: CreateChannelDto) {
    const newChannel = {
      ...createChannelDto,
      owner: +createChannelDto.owner
    };

    return await this.ChannelRepo.save(newChannel);
  }

  async findAll() {
    return await this.ChannelRepo.find();
  }

  async findOne(id: number) {
    return await this.ChannelRepo.findOne({ where: { id } });
  }

  async update(id: number, updateChannelDto: UpdateChannelDto) {
    const toUpdate = await this.findOne(id);
    const updated = Object.assign(updateChannelDto, toUpdate);

    return await this.ChannelRepo.save(updated);
  }

  async remove(id: number) {
    return await this.ChannelRepo.delete(id);
  }
}
