import { IsNumber, IsString } from 'class-validator';

export class CreateJoinchannelDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  channelId: number;

  @IsString()
  rank: string;

  @IsString()
  rights: string;

  @IsString()
  status: string;
}
