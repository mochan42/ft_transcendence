import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Friend {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sender: number;

  @Column()
  receiver: number;

  @Column()
  relation: string;

  @Column()
  createdAt: string;
}
