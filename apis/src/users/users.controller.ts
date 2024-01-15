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
import { CreateUserDto } from './dto/create-user.dto';
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch('xp/:id')
  updateXp(@Param('id') id: string, @Body() data: any ) {
    return this.usersService.updateXp(+id, data.xp);
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

  @Get('avatar/:image')
  getAvatar(@Param('image') avatar: string, @Res() res: Response) {
    const pathToAvar = join(__dirname, '..', '..', 'avatars', avatar);
    res.sendFile(pathToAvar);
  }

  @Get('exist/:userNameLoc')
  isUsedUsername(@Param('userNameLoc') userNameLoc: string) {
    return this.usersService.isUsedUsername(userNameLoc);
  }

  @Patch('2fa/:id')
  update2faOption(@Param('id') id: string) {
    return this.usersService.update2faOption(id);
  }
}
