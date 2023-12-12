import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GamesService } from '../games/games.service';
import { GameQueue } from './entities/gamequeue.entity';
import { Socket } from 'socket.io';

@Injectable()
export class GamequeueService {
  private static waitingList: Socket[] = [];

  constructor(
    @InjectRepository(GameQueue)
    private readonly gameQueueRepo: Repository<GameQueue>,
    private readonly gamesService: GamesService,
  ) {}

  findOpponent(socket: Socket) {
    if (GamequeueService.waitingList.length != 1) {
      GamequeueService.waitingList.push(socket);
      return null;
    }
    return GamequeueService.waitingList.pop();
  }
}
