import { Module } from '@nestjs/common';
import { PMatchService } from './p_match.service';
import { PMatchController } from './p_match.controller';

@Module({
  controllers: [PMatchController],
  providers: [PMatchService]
})
export class PMatchModule {}
