import { IsString } from 'class-validator';

export class MessageDto {
  @IsString()
  author: string;

  @IsString()
  message: string;

  @IsString()
  type: string;

  @IsString()
  receiver: string;
}
