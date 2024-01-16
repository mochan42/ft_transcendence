import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Goal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label?: string;

  @Column()
  image?: string;

  @Column()
  description?: string;
}
