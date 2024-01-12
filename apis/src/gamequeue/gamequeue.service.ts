import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GamesService } from '../games/games.service';
import { GameQueue } from './entities/gamequeue.entity';
import { Socket } from 'socket.io';

type Queued = {
  id: number,
  difficulty: number,
  isBoost: boolean,
  socket: Socket
};

@Injectable()
export class GamequeueService {
  private static waitingList: Queued[] = [];

  constructor(
    @InjectRepository(GameQueue)
    private readonly gameQueueRepo: Repository<GameQueue>,
    private readonly gamesService: GamesService,
  ) {}

  findOpponent(player: Queued) {
    if (GamequeueService.waitingList.length == 0) {
      GamequeueService.waitingList.push(player);
      return null;
    }
    const queuedPlayers = this.playersAlreadyWaiting(player);
    if (queuedPlayers.length == 0) {
      return null;
    }
    GamequeueService.waitingList = [...GamequeueService.waitingList.filter((el) => el.id != queuedPlayers[0].id)];
    return queuedPlayers[0];
  }

  playersAlreadyWaiting(player: Queued): Queued[]{
    const waiters = [...GamequeueService.waitingList].filter((el: Queued) => {
      return (el.id != player.id && el.difficulty == player.difficulty && el.isBoost == player.isBoost)
    });
    return waiters;
  }

  leaveQueue(playerId: number) {
    GamequeueService.waitingList = [...GamequeueService.waitingList].filter((el: Queued) => el.id != playerId);
  }
}
