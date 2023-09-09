import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Secret2faDTO } from './dto/secret-2fa.dto';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Response } from 'express';

@Controller('pong/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('auth')
  @HttpCode(200)
  authenticate(@Body() authUserDto: AuthUserDto) {
    return this.usersService.authenticate(authUserDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './avatars',
        filename: (req, file, cb) => {
          const createdAt = new Date();
          const avatar =
            req.body.name +
            req.body.id +
            createdAt.getDay() +
            createdAt.getMonth() +
            createdAt.getFullYear() +
            createdAt.getMilliseconds();
          console.log(avatar);

          //Calling the callback to rename the image
          cb(null, `${avatar}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('name') userName: string,
  ) {
    const avatar = (file && file.filename) || null;
    return this.usersService.update(+id, userName, avatar);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Get('auth/2fa/:id')
  generateSecret(@Param('id') id: string) {
    return this.usersService.generateSecret(id);
  }

  @Post('auth/2fa')
  @HttpCode(200)
  validateSecret(@Body() secret: Secret2faDTO) {
    return this.usersService.verify(secret);
  }

  @Get('avatar/:image')
  getAvatar(@Param('image') avatar: string, @Res() res: Response) {
    const pathToAvar = join(__dirname, '..', '..', 'avatars', avatar);
    res.sendFile(pathToAvar);
  }
}
