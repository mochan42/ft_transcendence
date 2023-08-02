import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';

@Controller('pong/users')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Post(':userId/achievements')
  create(
    @Param('userId') userId: string,
    @Body() createAchievementDto: CreateAchievementDto,
  ) {
    return this.achievementsService.create(userId, createAchievementDto);
  }

  @Get(':userId/achievements')
  findAll(@Param('userId') userId: string) {
    return this.achievementsService.findAll(userId);
  }

  @Get(':userId/achievements/:id')
  findOne(@Param('userId') userId: string, @Param('id') id: string) {
    return this.achievementsService.findOne(userId, +id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.achievementsService.remove(+id);
  }
}
