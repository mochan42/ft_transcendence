import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity()
export class Block {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  blockerUserId: number;

  @Column()
  blockeeUserId: number;
}
