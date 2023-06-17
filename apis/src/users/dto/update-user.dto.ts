import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { PrimaryGeneratedColumn } from 'typeorm';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @PrimaryGeneratedColumn()
  id: number;
  userName?: string;
  userNameLoc?: string;
  firstName?: string;
  lastName?: string;
  is2Fa?: boolean;
  authToken?: string;
  email?: string;
  secret2Fa?: string;
  avatar?: string;
  xp?: number;
  lastSeen?: Date;
  isLogged?: boolean;
}
