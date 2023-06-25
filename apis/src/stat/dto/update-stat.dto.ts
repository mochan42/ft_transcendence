import { PartialType } from '@nestjs/mapped-types';
import { CreateStatDto } from './create-stat.dto';

export class UpdateStatDto extends PartialType(CreateStatDto) {
  id: number;
  userId: number;
  wins = 0;
  losses = 0;
  draws = 0;
}
