import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GamesService } from '../games/games.service';
import { GameQueue } from './entities/gamequeue.entity';
import { Socket } from 'socket.io';

@Injectable()
export class GamequeueService {
  private waintingList: Socket[] = [];

  constructor(
    @InjectRepository(GameQueue)
    private readonly gameQueueRepo: Repository<GameQueue>,
    private readonly gamesService: GamesService,
  ) {}

  findOpponent(socket: Socket) {
    if (this.waintingList.length != 1) {
      this.waintingList.push(socket);
      return null;
    }
    return this.waintingList.pop();
  }
}
