import { Injectable } from '@nestjs/common';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement } from './entities/achievement.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AchievementsService {
  constructor(
    @InjectRepository(Achievement)
    private AchievementRepository: Repository<Achievement>,
    private readonly userService: UsersService,
  ) {}

  async create(userId: number, createAchievementDto: CreateAchievementDto) {
    try {
      const user = await this.userService.findOne(userId);
      const achiev = {
        ...createAchievementDto,
        userId: user.id,
        createdAt: new Date().toUTCString(),
      };
      console.log(achiev);
      return await this.AchievementRepository.save(achiev);
    } catch (error) {
      console.log(error);
      throw new Error('Error creating achievement');
    }
  }

  // find all user's achievement
  async findAll(userId: number) {
    return await this.AchievementRepository.find({ where: { userId } });
  }

  // a specific achievement
  async findOne(userId: number, goalId: number): Promise<Achievement> {
    return await this.AchievementRepository.findOne({
      where: { userId, goalId },
    });
  }

  async remove(id: number) {
    return await this.AchievementRepository.delete(id);
  }
}
