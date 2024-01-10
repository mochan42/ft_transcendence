import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';

@Controller()
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post('pong/games')
  create(@Body() createGameDto: CreateGameDto) {
    return this.gamesService.create(createGameDto);
  }

  @Get('pong/games')
  findAll() {
    return this.gamesService.findAll();
  }

  @Get('pong/games/:id')
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(+id);
  }

  @Get('pong/users/:id/games')
  findUsersGame(@Param('id') userId: string) {
    return this.gamesService.findUsersGame(+userId);
  }

  @Delete('pong/games:id')
  remove(@Param('id') id: string) {
    return this.gamesService.remove(+id);
  }

  @Delete('pong/games')
  removeAll() {
    return this.gamesService.removeAll();
  }
}
