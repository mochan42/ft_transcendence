import { IsBoolean, IsNumber, IsString, isBoolean } from 'class-validator';

export class CreateGameDto {
  @IsNumber()
  id: number;

  @IsNumber()
  player1: number;

  @IsNumber()
  player2: number;

  @IsNumber()
  difficulty: number;

  @IsBoolean()
  includeBoost: boolean;

  @IsBoolean()
  isReset: boolean;

  @IsString()
  status: string;

  @IsNumber()
  score1: number;

  @IsNumber()
  score2: number;

  @IsNumber()
  paddle1Y: number;

  @IsNumber()
  paddle2Y: number;

  @IsNumber()
  boostX: number;

  @IsNumber()
  boostY: number;

  @IsNumber()
  ballX: number;

  @IsNumber()
  ballY: number;

  @IsNumber()
  gameMaker: number;

  @IsNumber()
  paddle1Speed: number;

  @IsNumber()
  paddle2Speed: number;

  @IsNumber()
  paddle1Dir: number;

  @IsNumber()
  paddle2Dir: number;

  @IsNumber()
  speedX: number;

  @IsNumber()
  speedY: number;
}
