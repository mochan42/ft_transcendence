import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
export class GameQueue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  user: number;
}
