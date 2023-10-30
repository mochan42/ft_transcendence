import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamequeueService } from './gamequeue.service';
import { GameQueue } from './entities/gamequeue.entity';
import { GamequeueController } from './gamequeue.controller';
import { GamesModule } from 'src/games/games.module';

@Module({
  imports: [GamesModule, TypeOrmModule.forFeature([GameQueue])],
  controllers: [GamequeueController],
  providers: [GamequeueService],
  exports: [GamequeueService],
})
export class GamequeueModule {}
