import { Controller, HttpCode, Post, Body, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserDto } from 'src/users/dto/auth-user.dto';
import { Secret2faDTO } from 'src/users/dto/secret-2fa.dto';

@Controller('pong/users/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(200)
  sign(@Body() authUserDto: AuthUserDto) {
    return this.authService.signin(authUserDto);
  }

  @Get('2fa/:id')
  generateSecret(@Param('id') id: string) {
    return this.authService.generateSecret(id);
  }

  @Post('2fa')
  @HttpCode(200)
  validateSecret(@Body() secret: Secret2faDTO) {
    return this.authService.verify(secret);
  }

  @Post('token')
  @HttpCode(200)
  verifyToken(@Body() payload: any) {
    return this.authService.verifyAuthToken(payload.token);
  }
}
