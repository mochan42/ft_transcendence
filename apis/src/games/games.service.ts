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
  GAME_STATE,
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
    return this.gameRepo.find();
  }

  async findUsersGame(userId: number) {
    return this.gameRepo.find({
      where: [{ player1: userId }, { player2: userId }],
      order: { id: 'DESC' }
    });
  }

  async findOne(id: number) {
    return await this.gameRepo.findOne({ where: { id } });
  }

  async update(updateGame: Game) {
    return this.gameRepo.save(updateGame);
  }

  async remove(id: number) {
    return await this.gameRepo.delete(id);
  }

  async removeAll() {
    return await this.gameRepo.delete({});
  }
  
  async makeMatch(
    player1: number,
    player2: number,
    difficulty: number,
    isBoost: boolean,
  ) {
    const game: CreateGameDto = {
      id: -1,
      player1: player1,
      player2: player2,
      difficulty: difficulty,
      includeBoost: isBoost,
      isReset: false,
      status: 'request',
      score1: 0,
      score2: 0,
      paddle1Y: 0,
      paddle2Y: 0,
      boostX: 0,
      boostY: 0,
      ballX: 0,
      ballY: 0,
      gameMaker: -1,
      paddle1Speed: 30,
      paddle2Speed: 30,
      paddle1Dir: 1,
      paddle2Dir: 1,
      speedX: 5,
      speedY: 5,
    };
    return await this.gameRepo.save(game);
  }

  async acceptMatch(game: Game) {
    return await this.gameRepo.save(game);
  }
}
