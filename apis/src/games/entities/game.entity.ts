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
  difficulty: number;

  @Column({ nullable: true })
  includeBoost: boolean;
  
  @Column({ nullable: true})
  isBoost: boolean;

  @Column({ nullable: true})
  isReset: boolean;

  @Column({ nullable: true})
  isGameOver: boolean;

  @Column({ nullable: true})
  boostStartX: number;

  @Column({ nullable: true})
  boostStartY: number;

  @Column()
  status: string;

  @Column()
  score1: number;

  @Column()
  score2: number;

  @Column({ nullable: true })
  paddle1Y: number;

  @Column({ nullable: true })
  paddle2Y: number;

  @Column({ nullable: true })
  boostX: number;

  @Column({ nullable: true })
  boostY: number;

  @Column({ nullable: true })
  ballX: number;

  @Column({ nullable: true })
  ballY: number;

  @Column({ nullable: true })
  gameMaker: number;

  @Column({ nullable: true })
  paddle1Speed: number;

  @Column({ nullable: true })
  paddle2Speed: number;

  @Column({ nullable: true })
  paddle1Dir: number;

  @Column({ nullable: true })
  paddle2Dir: number;

  @Column({ nullable: true })
  speedX: number;

  @Column({ nullable: true })
  speedY: number;
}
