import { IsNumber, IsString } from 'class-validator';

export class CreateChannelDto {
  @IsString()
  password?: string;

  @IsString()
  title: String;

  @IsString()
  privacy: String;

  @IsNumber()
  ownerId: number;
}
