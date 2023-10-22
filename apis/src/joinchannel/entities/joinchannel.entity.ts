import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Joinchannel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user: number;

  @Column()
  channel: number;

  @Column({ nullable: true })
  satus: string;

  @Column()
  createdAt: string;
}
