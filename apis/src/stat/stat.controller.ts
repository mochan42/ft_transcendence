import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StatService } from './stat.service';
import { CreateStatDto } from './dto/create-stat.dto';
import { UpdateStatDto } from './dto/update-stat.dto';

@Controller('pong')
export class StatController {
  constructor(private readonly statService: StatService) {}

  @Get('stats')
  findAll() {
    return this.statService.findAll();
  }

  @Post('users/:userId/stats')
  create(
    @Param('userId') userId: string,
    @Body() createStatDto: CreateStatDto,
  ) {
    return this.statService.create(userId, createStatDto);
  }

  @Get('users/:userId/stats')
  findOne(@Param('userId') userId: string) {
    return this.statService.findOne(+userId);
  }

  @Patch('users/:userId/stats')
  update(
    @Param('userId') userId: string,
    @Body() updateStatDto: UpdateStatDto,
  ) {
    return this.statService.update(userId, updateStatDto);
  }

  // !!! NOT SURE ABOUT THIS ENDPOINT NECESSITY.
  @Delete('users/:userId/stats')
  remove(@Param('userId') userId: string) {
    return this.statService.remove(userId);
  }
}
