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

  async create(
    userId: string | null,
    createAchievementDto: CreateAchievementDto,
  ) {
    try {
      const user = await this.userService.findOne(+userId);
      const achiev = {
        ...createAchievementDto,
        userId: user.id.toString(),
        createdAt: new Date().toUTCString(),
      };
      return await this.AchievementRepository.save(achiev);
    } catch (error) {
      console.log(error);
      throw new Error('Error creating achievement');
    }
  }

  // find all user's achievement
  async findAll(userId: string | null) {
    return await this.AchievementRepository.find({ where: { userId } });
  }

  // a specific achievement
  async findOne(userId: string | null, goalId: number): Promise<Achievement> {
    return await this.AchievementRepository.findOne({
      where: { userId, goalId },
    });
  }

  async remove(id: number) {
    return await this.AchievementRepository.delete(id);
  }
}
