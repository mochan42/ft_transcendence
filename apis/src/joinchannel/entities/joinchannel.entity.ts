import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Joinchannel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  channelId: number;

  @Column()
  rank: string;

  @Column()
  rights: string;

  @Column()
  status: string;
}
