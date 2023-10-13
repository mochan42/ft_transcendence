import { Module } from '@nestjs/common';
import { StatService } from './stat.service';
import { StatController } from './stat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stat } from './entities/stat.entity';
import { UsersModule } from '../users/users.module';
@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Stat])],
  controllers: [StatController],
  providers: [StatService],
})
export class StatModule {}
