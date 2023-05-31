import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column()
  userNameLoc: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  is2Fa: boolean;

  @Column()
  authToken: string;

  @Column()
  email: string;

  @Column()
  secret2Fa: string;

  @Column()
  avatar: string;

  @Column()
  xp: number;

  @Column()
  isLogged: boolean;

  @Column()
  lastSeen: Date;
}
