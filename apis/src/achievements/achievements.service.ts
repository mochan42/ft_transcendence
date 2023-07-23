import { Injectable } from '@nestjs/common';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
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
    const user = await this.userService.findOne(userId);
    try {
      const achiev = {
        ...createAchievementDto,
        userId: userId,
        createdAt: 'ddhdjd',
      };
      return await this.AchievementRepository.save(achiev);
    } catch (error) {
      throw new Error('Error creating achievement');
    }
  }

  // find all user's achievement
  findAll(userId: number) {
    return this.AchievementRepository.find({ where: { userId } });
  }

  // a specific achievement
  findOne(userId: number, id: number) {
    return this.AchievementRepository.findOne({ where: { userId, id } });
  }

  update(id: number, updateAchievementDto: UpdateAchievementDto) {
    return `This action updates a #${id} achievement`;
  }

  remove(id: number) {
    return `This action removes a #${id} achievement`;
  }
}
