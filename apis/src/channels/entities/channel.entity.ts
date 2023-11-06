import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  channelId: number;

  @Column({ nullable: true })
  password: string;

  @Column()
  title: String;

  @Column()
  privacy: String;

  @Column()
  ownerId: number;
}
