import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { StatModule } from './stat/stat.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { GamesModule } from './games/games.module';
import { AchievementsModule } from './achievements/achievements.module';
import { GoalsModule } from './goals/goals.module';
import { FriendsModule } from './friends/friends.module';
import { AuthModule } from './auth/auth.module';
import { ChatsModule } from './chats/chats.module';
import { EventGateway } from './event.gateway';
import { ChannelsModule } from './channels/channels.module';
import { JoinchannelModule } from './joinchannel/joinchannel.module';
import { JoinchannelServiceService } from './joinchannel-service/joinchannel-service.service';
import { JoinchannelModule } from './joinchannel/joinchannel.module';

@Module({
  imports: [
    UsersModule,
    StatModule,
    AchievementsModule,
    ConfigModule.forRoot({}),
    DatabaseModule,
    GamesModule,
    AchievementsModule,
    GoalsModule,
    FriendsModule,
    AuthModule,
    ChatsModule,
    ChannelsModule,
    JoinchannelModule,
  ],
  controllers: [AppController],
  providers: [AppService, EventGateway, JoinchannelServiceService],
})
export class AppModule {}
