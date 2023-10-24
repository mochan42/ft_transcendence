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
    return await this.JoinchannelRepo.save(joinchannel);
  }

  async findAll() {
    return await this.JoinchannelRepo.find();
  }
}
