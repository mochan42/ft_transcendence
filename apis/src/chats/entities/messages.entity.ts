import { Entity, Column, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  author: number;

  @Column()
  message: string;

  @Column()
  type: string;

  @Column()
  receiver: number;
}
