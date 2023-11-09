import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Joinchannel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: number;

  @Column({ nullable: true })
  channelId: number;

  @Column({ nullable: true })
  rank: string;

  @Column({ nullable: true })
  rights: string;

  @Column({ nullable: true })
  status: string;
}
