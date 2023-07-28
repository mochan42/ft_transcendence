import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { AuthUserDto } from './dto/auth-user.dto';
import axios from 'axios';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private UserRepository: Repository<User>,
  ) {}
  async authenticate(authUserDto: AuthUserDto) {
    const urlAuth42 = 'https://api.intra.42.fr/oauth/token';
    const params42 = {
      grant_type: 'authorization_code',
      client_id:
        'u-s4t2ud-9c04e10e264f25f8b3cb9bef48ae57df091de510f43e87c7647da4b885b6210b',
      client_secret:
        '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',
      code: authUserDto.token,
      redirect_uri: 'http://localhost:3000/profile',
      state: 'must log be secure',
    };
    try {
      const accessToken = await axios.post(urlAuth42, params42);
      const params = {
        headers: {
          Authorization: 'Bearer ' + accessToken.data.access_token,
          'Content-Type': 'application/json',
        },
      };
      const resp = await axios.get('https://api.intra.42.fr/v2/me', params);
      const user42 = resp.data;
      const [first, last] = user42.displayname.split(' ');
      const userPong = {
        userName: user42.login,
        userNameLoc: user42.login,
        firstName: first,
        lastName: last,
        is2Fa: false,
        authToken: '',
        email: user42.email,
        secret2Fa: '',
        avatar: user42.image.link,
        xp: 0,
        isLogged: true,
        lastSeen: new Date().toISOString()
      };
      try {
        const newUser = await this.UserRepository.save(userPong);
        return newUser.id;
      } catch (error) {
        console.log(error);
      }
      return 'QUOI ?';
    } catch (error) {
      console.log(error);
    }
  }

  async findAll(): Promise<User[]> {
    return await this.UserRepository.find();
  }

  async findOne(id: number) {
    return this.UserRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const toUpdate = await this.UserRepository.findOne({ where: { id } });
    const updated = Object.assign(toUpdate, updateUserDto);
    return await this.UserRepository.save(updated);
  }

  async remove(userId: number) {
    return await this.UserRepository.delete(+userId);
  }
}
