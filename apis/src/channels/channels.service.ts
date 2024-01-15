import { Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './entities/channel.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private ChannelRepo: Repository<Channel>,
  ) {}
  async create(createChannelDto: CreateChannelDto) {
    const newChannel = {
      ...createChannelDto,
      password: await this.cryptPasswd(createChannelDto.password),
    };
    return await this.ChannelRepo.save(newChannel);
  }

  async findAll() {
    return await this.ChannelRepo.find();
  }

  async findOne(channelId: number) {
    return await this.ChannelRepo.findOne({ where: { channelId } });
  }

  async update(id: number, updateChannelDto: UpdateChannelDto) {
    const toUpdate = await this.findOne(id);
    const updated = Object.assign(updateChannelDto, toUpdate);

    return await this.ChannelRepo.save(updated);
  }

  async remove(channelId: number) {
    return await this.ChannelRepo.delete(channelId);
  }

  async cryptPasswd(passwd: string | null): Promise<string | null> {
    if (!passwd) {
      return null;
    }
    const saltRounds = 10;
    return await bcrypt.hash(passwd, saltRounds);
  }

  async comparePassword(
    userPasswd: string,
    dbPasswd: string,
  ): Promise<boolean> {
    return await bcrypt.compare(userPasswd, dbPasswd);
  }

  async updateByEntity(update: Channel) {
    return await this.ChannelRepo.save(update);
  }
  
  async verifyPasswd(input: string, group: number) {
    const channel = await this.findOne(group);
    await Promise.all([channel]);
    if (!group) return false;
    return await this.comparePassword(input, channel.password);
  }

  async removeAll() {
    return await this.ChannelRepo.delete({});
  }
}
