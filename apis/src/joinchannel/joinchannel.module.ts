import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Joinchannel } from './entities/joinchannel.entity';
import { JoinchannelService } from './joinchannel/joinchannel.service';

@Module({
  imports: [TypeOrmModule.forFeature([Joinchannel])],
  providers: [JoinchannelService],
  exports: [JoinchannelService],
})
export class JoinchannelModule {}
