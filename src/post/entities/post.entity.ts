import { configDotenv } from 'dotenv';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

configDotenv();

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  postId: number;

  @Column()
  @ManyToOne(() => User, (user) => user.userId)
  @JoinColumn({ name: 'userId' })
  userId: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  title: string;

  @Column({ type: 'longtext', nullable: false })
  contents: string;

  @Column({ type: 'varchar', length: 30, nullable: false })
  writer: string;

  @Column({ nullable: false, default: process.env.DEFULT_POST_BANNER_URL })
  mainImg: string;

  @Column({ nullable: false, default: '' })
  tags: string;

  @Column({ nullable: false })
  createdAt: string;
}
