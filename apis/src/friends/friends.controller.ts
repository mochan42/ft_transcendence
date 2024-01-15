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
import { ACCEPTED } from 'src/APIS_CONSTS';

@Controller('pong')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get('friends')
  findAll() {
    return this.friendsService.findAll();
  }
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
  async update(
    @Param('id') id: string,
    @Body() updateFriendDto: UpdateFriendDto,
  ) {
    const friend = await this.friendsService.findBYId(+id);
    const updatedFriend = { ...friend, relation: ACCEPTED };
    return this.friendsService.update(updatedFriend);
  }

  @Delete('friends/:id')
  remove(@Param('id') id: string) {
    return this.friendsService.remove(+id);
  }

  @Get('blocks')
  async findAllBlocked() {
    return this.friendsService.findAllBlock();
  }
}
