import { IsNumber, IsString } from 'class-validator';

export class CreateChannelDto {
  @IsNumber()
  owner: number;

  @IsString()
  label: string;

  @IsString()
  type: string;

  @IsString()
  password?: string;

  @IsString()
  createdAt: string;
}
