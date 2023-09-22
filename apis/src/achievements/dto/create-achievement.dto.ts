import { IsString, IsNumber } from 'class-validator';

export class CreateAchievementDto {
  userId?: number;

  @IsNumber()
  goalId: number;

  @IsString()
  createdAt?: string;
}
