import { Injectable } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friend } from './entities/friend.entity';
import { MEMBER_RIGHTS } from '../APIS_CONSTS';
import { Block } from '../chats/entities/block.entity';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friend)
    private FriendRepo: Repository<Friend>,
    @InjectRepository(Block)
    private BlockingRepo: Repository<Block>,
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

  async blockUser(blockerUserId: number, blockeeUserId: number) {
    const blockedUser = {
      blockerUserId: blockerUserId,
      blockeeUserId: blockeeUserId,
    };
    return await this.BlockingRepo.save(blockedUser);
  }

  async findAllBlock() {
    return await this.BlockingRepo.find();
  }

  async unblock(blocker: number, blockee: number) {
    const block = await this.BlockingRepo.find({
      where: {
        blockerUserId: blocker,
        blockeeUserId: blockee,
      },
    });
    return this.BlockingRepo.delete(block[0].id);
  }
}
