import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Stat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userId: string | null;

  @Column()
  wins?: number;

  @Column()
  losses?: number;

  @Column()
  draws?: number;
}
