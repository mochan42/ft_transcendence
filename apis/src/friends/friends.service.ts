import { Injectable } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friend } from './entities/friend.entity';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friend)
    private FriendRepo: Repository<Friend>,
  ) {}

  async create(createFriendDto: CreateFriendDto): Promise<Friend> {
    const friend = {
      ...createFriendDto,
      createdAt: new Date().toUTCString(),
    };
    return await this.FriendRepo.save(friend);
  }

  async find(userId: number) {
    return await this.FriendRepo.find({
      where: [{ sender: userId }, { receiver: userId }],
    });
  }

  async update(id: number, updateFriendDto: UpdateFriendDto) {
    const matchedFriend = await this.FriendRepo.findOne({ where: { id } });
    const updatedFriend = Object.assign(matchedFriend, updateFriendDto);
    console.log(updatedFriend);
    return await this.FriendRepo.save(updatedFriend);
  }

  async remove(id: number) {
    return await this.FriendRepo.delete(id);
  }
}
