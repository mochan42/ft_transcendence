import { Injectable } from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal } from './entities/goal.entity';
@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal)
    private GoalRepository: Repository<Goal>,
  ) {}

  async create(createGoalDto: CreateGoalDto) {
    return await this.GoalRepository.save(createGoalDto);
  }

  async findAll() {
    return await this.GoalRepository.find();
  }

  findOne(id: number) {
    return this.GoalRepository.findOne(id);
  }

  async update(
    id: number,
    updateGoalDto: UpdateGoalDto,
  ): Promise<UpdateGoalDto> {
    const matchedGoal = await this.GoalRepository.findOne(id);
    const updatedGoal = Object.assign(matchedGoal, updateGoalDto);
    return await this.GoalRepository.save(updatedGoal);
  }

  async remove(id: number) {
    return await this.GoalRepository.delete(id);
  }
}
