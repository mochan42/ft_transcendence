import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { AuthUserDto } from './dto/auth-user.dto';
import axios from 'axios';
import { CreateUserDto } from './dto/create-user.dto';

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
      redirect_uri: 'http://localhost:3000',
      state: 'helllllllllllllllllllllllllllllll',
    };
    //const accessToken = await axios.post(urlAuth42, params42);
    console.log('************************FIRST CALL API**************\n');
    // console.log(accessToken.status);
    // console.log(accessToken.data);
    console.log('************************FIRST CALL API**************\n');
    // const params = {
    //   headers: {
    //     Authorization: 'Bearer ' + accessToken.data.access_token,
    //     'Content-Type': 'application/json',
    //   },
    // };
    //const resp = await axios.get('https://api.intra.42.fr/v2/me', params);
    //const user42 = resp.data;
    // const [first, last] = user42.displayname.split(' ');
    // const userPong = {
    //   userName: user42.login,
    //   userNameLoc: user42.login,
    //   firstName: first,
    //   lastName: last,
    //   is2Fa: false,
    //   authToken: '',
    //   email: user42.email,
    //   secret2Fa: '',
    //   avatar: user42.image.link,
    //   xp: 0,
    //   isLogged: true,
    //   lastSeen: new Date().toISOString(),
    // };
    // try {
    //   const newUser = await this.UserRepository.save(userPong);
    //   return newUser.id;
    // } catch (error) {
    //   console.log(error);
    // }
    //console.log(resp.data);
    //console.log(resp.status);
    return '23';
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

  async remove(userId: string | null) {
    return await this.UserRepository.delete(+userId);
  }

  async create(createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return await this.UserRepository.save(createUserDto);
  }
}
