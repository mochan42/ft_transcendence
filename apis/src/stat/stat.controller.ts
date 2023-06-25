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

@Controller('users')
export class StatController {
  constructor(private readonly statService: StatService) {}

  @Post('/stats')
  create(@Body() createStatDto: CreateStatDto) {
    return this.statService.create(createStatDto);
  }

  // !!! NOT SURE ABOUT THIS ENDPOINT NECESSITY
  @Get()
  findAll() {
    return this.statService.findAll();
  }

  @Get(':userId/stats')
  findOne(@Param('userId') id: string) {
    return this.statService.findOne(+id);
  }

  @Patch(':userId/stats')
  update(@Param('userId') id: string, @Body() updateStatDto: UpdateStatDto) {
    return this.statService.update(+id, updateStatDto);
  }

  // !!! NOT SURE ABOUT THIS ENDPOINT NECESSITY.
  @Delete(':userId/stats')
  remove(@Param('userId') id: string) {
    return this.statService.remove(+id);
  }
}
