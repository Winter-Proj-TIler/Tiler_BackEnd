import { configDotenv } from 'dotenv';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

configDotenv();

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ length: 30, nullable: false, unique: true })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ length: 50, nullable: false, unique: true })
  email: string;

  @Column({ nullable: false, default: 0 })
  following: number;

  @Column({ nullable: false, default: 0 })
  followers: number;

  @Column({ length: 50, nullable: true })
  statusMsg: string;

  @Column({ nullable: false, default: process.env.DEFAULT_PROFILE_URL })
  profileImg: string;
}
