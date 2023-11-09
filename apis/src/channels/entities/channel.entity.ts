import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  channelId: number;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  title: String;

  @Column({ nullable: true })
  privacy: String;

  @Column({ nullable: true })
  ownerId: number;
}
