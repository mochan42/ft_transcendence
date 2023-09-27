import { Column, PrimaryGeneratedColumn } from "typeorm"

export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  owner: number;
  
  @Column()
  label: String;
	
  @Column()
  type: String;
	
  @Column()
  password?: String;
}
