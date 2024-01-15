import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  userNameLoc: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsBoolean()
  is2Fa: boolean;

  @IsString()
  @IsNotEmpty()
  authToken: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  secret2Fa?: string;

  @IsString()
  avatar: string;

  @IsNumber()
  xp: number;

  @IsString()
  currentState: string;

  @IsString()
  lastSeen?: string;
}
