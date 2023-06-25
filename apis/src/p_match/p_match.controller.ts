import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PMatchService } from './p_match.service';
import { CreatePMatchDto } from './dto/create-p_match.dto';
import { UpdatePMatchDto } from './dto/update-p_match.dto';

@Controller('p-match')
export class PMatchController {
  constructor(private readonly pMatchService: PMatchService) {}

  @Post()
  create(@Body() createPMatchDto: CreatePMatchDto) {
    return this.pMatchService.create(createPMatchDto);
  }

  @Get()
  findAll() {
    return this.pMatchService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pMatchService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePMatchDto: UpdatePMatchDto) {
    return this.pMatchService.update(+id, updatePMatchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pMatchService.remove(+id);
  }
}
