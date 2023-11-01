import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateGameDto {
  @IsNumber()
  player1: number;

  @IsNumber()
  player2: number;

  @IsNumber()
  score1: number;

  @IsNumber()
  score2: number;

  @IsNumber()
  difficulty: number;

  @IsNumber()
  ballX: number;

  @IsNumber()
  ballY: number;

  @IsNumber()
  leftPaddleY: number;

  @IsNumber()
  rightPaddleY: number;

  @IsNumber()
  boostX: number;

  @IsNumber()
  boostY: number;

  @IsString()
  status: string;
}
