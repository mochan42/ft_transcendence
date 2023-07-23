import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Achievement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  label: string;

  @Column()
  description?: string;

  @Column()
  image?: string;

  @Column()
  createAt?: string;
}
