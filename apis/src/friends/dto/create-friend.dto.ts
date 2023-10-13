import { IsNumber, IsString } from 'class-validator';

export class CreateFriendDto {
  @IsNumber()
  receiver: number;

  @IsNumber()
  sender: number;

  @IsString()
  relation: string;

  createdAt: string;
}
