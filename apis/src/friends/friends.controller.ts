import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';

@Controller('pong')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post('friends')
  //!!TODO : Make sure sender and receiver exist;
  create(@Body() createFriendDto: CreateFriendDto) {
    return this.friendsService.create(createFriendDto);
  }

  @Get('users/:userId/friends')
  findOne(@Param('userId') userId: string) {
    return this.friendsService.find(userId);
  }

  @Patch('friends/:id')
  update(@Param('id') id: string, @Body() updateFriendDto: UpdateFriendDto) {
    return this.friendsService.update(+id, updateFriendDto);
  }

  @Delete('friends/:id')
  remove(@Param('id') id: string) {
    return this.friendsService.remove(+id);
  }
}
