import { Injectable } from '@nestjs/common';
import { CreateStatDto } from './dto/create-stat.dto';
import { UpdateStatDto } from './dto/update-stat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stat } from './entities/stat.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class StatService {
  constructor(
    @InjectRepository(Stat)
    private StatRepository: Repository<Stat>,
    private usersService: UsersService,
  ) {}
  async create(userId: string | null, createStatDto: CreateStatDto) {
    const user = await this.usersService.findOne(+userId);
    try {
      const newStat = {
        ...createStatDto,
        userId: user.id.toString(),
      };
      return await this.StatRepository.save(newStat);
    } catch (error) {
      throw new Error('Error creating stat');
    }
  }

  async findOne(id: number) {
    return await this.StatRepository.findOne({
      where: { userId: id.toString() },
    });
  }

  async findAll() {
    return await this.StatRepository.find();
  }

  async update(id: string, updateStatDto: UpdateStatDto) {
    const oldStat = await this.StatRepository.findOne({
      where: { userId: id },
    });
    if (!oldStat) {
      console.log('here\n');
      return await this.create(id, updateStatDto);
    }
    const UpdatedStat = Object.assign(oldStat, updateStatDto);
    return await this.StatRepository.save(UpdatedStat);
  }

  async remove(id: string) {
    try {
      //await this.usersService.remove(id.toString());
      return await this.StatRepository.delete({ userId: id });
    } catch (error) {
      throw new Error('error deleting user stat');
    }
  }
}
