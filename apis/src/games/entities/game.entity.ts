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

  @Column()
  difficulty: number;

  @Column({nullable: true})
  ballX: number;

  @Column({nullable: true})
  ballY: number;

  @Column({nullable: true})
  leftPaddleY: number;

  @Column({nullable: true})
  rightPaddleY: number;

  @Column({nullable: true})
  boostX: number;

  @Column({nullable: true})
  boostY: number;

  @Column()
  status: string;
}
