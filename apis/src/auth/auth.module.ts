import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { StatModule } from 'src/stat/stat.module';

@Module({
  imports: [UsersModule, StatModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
