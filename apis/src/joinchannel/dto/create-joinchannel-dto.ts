import { IsNumber, IsString } from 'class-validator';

export class CreateJoinchannelDto {
  @IsNumber()
  user: number;

  @IsNumber()
  channel: number;

  @IsString()
  status?: string;

  @IsString()
  createdAt: string;
}
