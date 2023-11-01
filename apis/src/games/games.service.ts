import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Repository } from 'typeorm';
import {
  BALL_X_ZERO,
  BALL_Y_ZERO,
  BOOST_X_ZERO,
  BOOST_Y_ZERO,
  LEFT_PADDLE_Y_ZERO,
  RIGHT_PADDLE_Y_ZERO,
  GAME_STATE
} from '../APIS_CONSTS';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepo: Repository<Game>,
  ) {}

  async create(createGameDto: CreateGameDto) {
    return await this.gameRepo.save(createGameDto);
  }

  async findAll() {
    return await this.gameRepo.find();
  }

  async findOne(id: number) {
    return await this.gameRepo.findOne({ where: { id } });
  }

  async update(updateGame: Game) {
    return this.gameRepo.save(updateGame);
  }

  async remove(id: number) {
    return `This action removes a #${id} game`;
  }

  async makeMatch(player1: number, player2: number, difficulty: number, isBoost: boolean) {
    const game: CreateGameDto = {
      player1: player1,
      player2: player2,
      score1: 0,
      score2: 0,
      difficulty: difficulty,
      ballX: null,
      ballY: null,
      leftPaddleY: null,
      rightPaddleY: null,
      boostX: null,
      boostY: null,
      status: 'request'
    };
    return await this.gameRepo.save(game);
  }
}
