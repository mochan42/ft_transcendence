import { Module } from '@nestjs/common';
import { StatService } from './stat.service';
import { StatController } from './stat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stat } from './entities/stat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stat])],
  controllers: [StatController],
  providers: [StatService],
})
export class StatModule {}
