import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Joinchannel } from '../entities/joinchannel.entity';
import { CreateJoinchannelDto } from '../dto/create-joinchannel-dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class JoinchannelService {
  constructor(
    @InjectRepository(Joinchannel)
    private JoinchannelRepo: Repository<Joinchannel>,
  ) {}

  async create(joinchannel: CreateJoinchannelDto) {
    return this.JoinchannelRepo.save(joinchannel);
  }

  async findAll() {
    return this.JoinchannelRepo.find();
  }
}
