import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
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
  lastSeen?: string;
  isLogged?: boolean;
}
