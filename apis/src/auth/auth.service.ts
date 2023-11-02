import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AuthUserDto } from 'src/users/dto/auth-user.dto';
import { UsersService } from 'src/users/users.service';
import axios from 'axios';
import { Secret2faDTO } from '../users/dto/secret-2fa.dto';
import { totp, authenticator } from 'otplib';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  async signin(authUserDto: AuthUserDto) {
    console.log('---------------------\n');
    console.log('CODE: ', authUserDto.token);
    console.log('---------------------\n');
    const accessToken = await this.getFortyTwoAccessToken(authUserDto);
    if (!accessToken) {
      console.log('----FAILLED ACCESS TOKEN--------\n');
      return { is2Fa: false, user: null };
    }
    const user42 = await this.getFortyTwoUserInfo(accessToken.access_token);
    const pongUser = this.createPongUser(user42);

    const matchedUser = await this.usersService.findByUserName(
      pongUser.userName,
    );
    var signedUser;
    var logTimes = true;

    if (matchedUser) {
      signedUser = await this.usersService.updateLoginState(
        matchedUser.id,
        true,
      );
      logTimes = false;
    } else {
      signedUser = await this.usersService.create(pongUser);
    }

    if (!signedUser.is2Fa) {
      return { is2Fa: false, user: signedUser, isFirstLogin: logTimes };
    }
    const token2fa = await this.generateSecret(signedUser.id.toString());
    return { is2Fa: true, token2fa, isFirstLogin: false };
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

  async generateSecret(id: string) {
    const secret = authenticator.generateSecret();
    const secret2fa: string = totp.generate(secret);
    try {
      const user = await this.usersService.findOne(+id);
      const updatedUser: CreateUserDto = {
        ...user,
        secret2Fa: secret,
        authToken: secret2fa,
      };
      const updated = await this.usersService.create(updatedUser);
      if (user && updated) {
        return secret2fa + '_' + id + '_' + secret;
      }
    } catch (error) {
      console.log('user not found', error);
    }
    throw new HttpException(
      'Generating secret failled',
      HttpStatus.FAILED_DEPENDENCY,
    );
  }

  async verify(secret: Secret2faDTO) {
    try {
      const user = await this.usersService.findOne(+secret.userId);
      //const isValid = totp.check(secret.token, user.secret2Fa);
      const isValid = secret.token === user.authToken;
      if (isValid) {
        await this.generateSecret(user.id.toString());
        return 'OK';
      }
      return this.generateSecret(user.id.toString());
    } catch (error) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
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

  private async getFortyTwoAccessToken(authUserDto: AuthUserDto) {
    const urlAuth42 = 'https://api.intra.42.fr/oauth/token';
    const params42 = {
      grant_type: 'authorization_code',
      client_id: process.env.UID,
      client_secret: process.env.SECRET,
      code: authUserDto.token,
      redirect_uri: 'https://special-dollop-r6jj956gq9xf5r9-3000.app.github.dev/',
      state: authUserDto.state,
    };
    try {
      const resp = await axios.post(urlAuth42, params42);
      return resp.data;
    } catch (error) {
      console.log('*************WTF*****************\n');
      console.log(error);
      console.log('*************WTF*****************\n');
    }
  }
}
