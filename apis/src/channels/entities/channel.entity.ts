import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  owner: number;

  @Column()
  label: String;

  @Column()
  type: String;

  @Column({ nullable: true })
  password: String;
}
