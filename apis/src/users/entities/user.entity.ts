import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: false })
  userName: string;

  @Column({ unique: false })
  userNameLoc: string;

  @Column()
  firstName?: string;

  @Column()
  lastName?: string;

  @Column()
  is2Fa: boolean;

  @Column()
  authToken?: string;

  @Column({ unique: false })
  email: string;

  @Column()
  secret2Fa?: string;

  @Column()
  avatar?: string;

  @Column()
  xp: number;

  @Column()
  isLogged: boolean;

  @Column()
  lastSeen?: string;
}

export default User;
