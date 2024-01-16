import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Joinchannel } from '../entities/joinchannel.entity';
import { CreateJoinchannelDto } from '../dto/create-joinchannel-dto';

@Injectable()
export class JoinchannelService {
  constructor(
    @InjectRepository(Joinchannel)
    private JoinchannelRepo: Repository<Joinchannel>,
  ) {}

  async create(joinchannel: CreateJoinchannelDto) {
    const check = await this.JoinchannelRepo.find(
      {
        where: {
          userId: joinchannel.userId,
          channelId: joinchannel.channelId
        }
      })
    if (check.length != 0) return null;
    return await this.JoinchannelRepo.save(joinchannel);
  }

  async findAll() {
    return await this.JoinchannelRepo.find();
  }

  async delete(id: number) {
    return await this.JoinchannelRepo.delete(id);
  }

  async deleteAll() {
    return await this.JoinchannelRepo.delete({});
  }

  async deleteJoin(userId: number, channelId: number) {
    const join = await this.JoinchannelRepo.find({
      where: { userId: userId, channelId: channelId },
    });
    if (join) {
      return this.delete(join[0].id);
    }
  }

  async findAGroupMembers(channelId: number) {
    return await this.JoinchannelRepo.find({ where: { channelId } });
  }
  async update(joinChannel: Joinchannel) {
    return await this.JoinchannelRepo.save(joinChannel);
  }
  async findAfterInsert(candidates: any) {
    return await this.JoinchannelRepo.find();
  }
}
