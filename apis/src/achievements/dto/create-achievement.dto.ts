import { IsString } from "class-validator";

export class CreateAchievementDto {
  userId?: number;

  @IsString()
  label: string;

  @IsString()
  description?: string;

  @IsString()
  image?: string;

  @IsString()
  createdAt?: string;
}
