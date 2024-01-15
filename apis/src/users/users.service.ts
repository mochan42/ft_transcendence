import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private UserRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.UserRepository.find();
  }

  async findOne(id: number) {
    return await this.UserRepository.findOne({ where: { id } });
  }

  async findByUserName(userName: string) {
    return await this.UserRepository.findOne({ where: { userName } });
  }

  async update(id: number, userNameLoc: string, avatar: string) {
    const toUpdate = await this.UserRepository.findOne({ where: { id } });
    if (avatar) {
      avatar =
        process.env.BACKEND_URL + '/users/avatar/' +
        avatar;
    } else {
      avatar = toUpdate.avatar;
    }
    const updated = {
      ...toUpdate,
      userNameLoc,
      avatar,
    };
    return await this.UserRepository.save(updated);
  }

  async remove(userId: string | null) {
    return await this.UserRepository.delete(+userId);
  }

  async create(createUserDto: CreateUserDto) {
    return await this.UserRepository.save(createUserDto);
  }

  async isUsedUsername(userNameLoc: string) {
    const user = await this.UserRepository.findOne({ where: { userNameLoc } });
    return user ? true : false;
  }

  async update2faOption(id: string) {
    const user = await this.findOne(+id);
    const is2Fa = user.is2Fa ? false : true;
    const updateUser = { ...user, is2Fa };
    return await this.UserRepository.save(updateUser);
  }

  async updateLoginState(id: number, state: string) {
    const user = await this.findOne(id);
    const updatedUser = { ...user, currentState: state };
    return await this.UserRepository.save(updatedUser);
  }

  async updateUserXp(id: number, xp: number) {
    const user = await this.findOne(id);
    const updatedUser = { ...user, xp: user.xp + xp };
    return await this.UserRepository.save(updatedUser);
  }
  async updateXp(id: number, xp: number) {
    const user = await this.findOne(id);
    const updatedUser = { ...user, xp };
    return await this.UserRepository.save(updatedUser);
  }
}


