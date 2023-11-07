import { Injectable } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
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
    return await this.FriendRepo.save(createFriendDto);
  }

  async findAll() {
    return await this.FriendRepo.find();
  }

  async find(userId: string) {
    const id = parseInt(userId);
    if (isNaN(id)) {
      return [];
    }
    return await this.FriendRepo.find({
      where: [{ sender: id }, { receiver: id }],
    });
  }

  async findBYId(id: number): Promise<Friend> {
    return await this.FriendRepo.findOne({ where: { id: id } });
  }

  async update(updatedFriend: Friend) {
    return await this.FriendRepo.save(updatedFriend);
  }

  async remove(id: number) {
    return await this.FriendRepo.delete(id);
  }

}
