import { IsString } from 'class-validator';

export class CreateGoalDto {
  @IsString()
  label?: string;

  @IsString()
  image?: string;

  @IsString()
  description?: string;
}
