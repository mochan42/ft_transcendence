import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { StatModule } from 'src/stat/stat.module';
import { JwtModule } from '@nestjs/jwt';
import { GoalsModule } from 'src/goals/goals.module';

@Module({
  imports: [
    UsersModule,
    StatModule,
    GoalsModule,
    JwtModule.register({
      global: true,
      secret: process.env.SECRET,
      signOptions: { expiresIn: '120s' },
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports:[AuthService],
})
export class AuthModule {}
