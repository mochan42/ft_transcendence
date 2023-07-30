import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Achievement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string | null;

  @Column()
  goalId: number;

  @Column()
  createdAt?: string;
}
