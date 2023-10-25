import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  player1: number;

  @Column()
  player2: number;

  @Column()
  score1: number;

  @Column()
  score2: number;

  @Column({ nullable: true })
  difficulty: string;

  @Column()
  isGameOver: boolean;

  @Column()
  ballX: number;

  @Column()
  ballY: number;

  @Column()
  leftPaddleY: number;

  @Column()
  rightPaddleY: number;

  @Column()
  boostX: number;

  @Column()
  boostY: number;

  @Column()
  state: string;
}
