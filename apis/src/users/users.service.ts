import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { AuthUserDto } from './dto/auth-user.dto';
import axios from 'axios';
import { CreateUserDto } from './dto/create-user.dto';
import { Secret2faDTO } from './dto/secret-2fa.dto';
import { totp, authenticator } from 'otplib';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private UserRepository: Repository<User>,
  ) {}

  private async getFortyTwoAccessToken(authUserDto: AuthUserDto) {
    const urlAuth42 = 'https://api.intra.42.fr/oauth/token';
    const params42 = {
      grant_type: 'authorization_code',
      client_id: process.env.UID,
      client_secret: process.env.SECRET,
      code: authUserDto.token,
      redirect_uri: 'http://localhost:3000',
      state: authUserDto.state,
    };
    const resp = await axios.post(urlAuth42, params42);
    return resp.data;
  }

  private async getFortyTwoUserInfo(token: string) {
    const params = {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    };
    const resp = await axios.get('https://api.intra.42.fr/v2/me', params);
    return resp.data;
  }

  private createPongUser(user42: any) {
    const [first, last] = user42.displayname.split(' ');
    const pongUser = {
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
      lastSeen: new Date().toISOString(),
    };
    return pongUser;
  }
  async authenticate(authUserDto: AuthUserDto) {
    const accessToken = await this.getFortyTwoAccessToken(authUserDto);
    const user42 = await this.getFortyTwoUserInfo(accessToken.access_token);
    const pongUser = this.createPongUser(user42);
    const matchedUser = await this.findByUserName(pongUser.userName);
    if (matchedUser) {
      return matchedUser;
    }
    const newUser = await this.UserRepository.save(pongUser);
    return newUser;
  }

  async findAll(): Promise<User[]> {
    return await this.UserRepository.find();
  }

  async findOne(id: number) {
    return await this.UserRepository.findOne({ where: { id } });
  }

  private async findByUserName(userName: string) {
    return await this.UserRepository.findOne({ where: { userName } });
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
    return await this.UserRepository.save(createUserDto);
  }

  async generateSecret(id: string) {
    const secret = authenticator.generateSecret();
    const secret2fa: string = totp.generate(secret);
    try {
      const user = await this.findOne(+id);
      const updatedUser = { ...user, secret2Fa: secret };
      const updated = await this.UserRepository.save(updatedUser);
      if (user && updated) {
        return secret2fa;
      }
    } catch (error) {
      console.log('user not found', error);
    }
    throw new HttpException('Gerating secret failled', HttpStatus.FAILED_DEPENDENCY);
  }
  async verify(secret: Secret2faDTO) {
    try {
      const user = await this.findOne(+secret.userId);
      const isValid = totp.check(secret.token, user.secret2Fa);
      if (isValid) {
        this.generateSecret(user.id.toString());
        return 'OK';
      } else {
        throw new HttpException('token not valid', HttpStatus.UNAUTHORIZED);
      }
    } catch (error) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
  }
}
