import { Injectable } from '@nestjs/common';
import { CreateStatDto } from './dto/create-stat.dto';
import { UpdateStatDto } from './dto/update-stat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stat } from './entities/stat.entity';

@Injectable()
export class StatService {
  constructor(
    @InjectRepository(Stat)
    private StatRepository: Repository<Stat>,
  ) {}
  async create(createStatDto: CreateStatDto) {
    return await this.StatRepository.save(createStatDto);
  }

  async findAll(): Promise<Stat[]> {
    return await this.StatRepository.find();
  }

  async findOne(id: number) {
    return await this.StatRepository.findOne({ where: { userId: id } });
  }

  async update(id: number, updateStatDto: UpdateStatDto) {
    const oldStat = this.StatRepository.findOne({ where: { userId: id } });
    const UpdatedStat = Object.assign(oldStat, updateStatDto);
    return await this.StatRepository.save(UpdatedStat);
  }

  async remove(id: number) {
    return await this.StatRepository.delete({ userId: id });
  }
}
