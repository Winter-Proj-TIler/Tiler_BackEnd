import { configDotenv } from 'dotenv';
import { Comment } from 'src/comment/entities/comment.entity';
import { Follow } from 'src/follow/entities/follow.entity';
import { PostLike } from 'src/like/entities/like.entity';
import { Post } from 'src/post/entities/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ length: 50, nullable: true })
  statusMsg: string;

  @Column({ nullable: false, default: process.env.DEFAULT_PROFILE_URL })
  profileImg: string;

  @OneToMany(() => Post, (post) => post.user, { onDelete: 'CASCADE' })
  post: Post[];

  @OneToMany(() => PostLike, (like) => like.user, { onDelete: 'CASCADE' })
  like: PostLike[];

  @OneToMany(() => Follow, (follow) => follow.follower, { onDelete: 'CASCADE' })
  follower: Follow[];

  @OneToMany(() => Follow, (follow) => follow.following, { onDelete: 'CASCADE' })
  following: Follow[];

  @OneToMany(() => Comment, (comment) => comment.user, { onDelete: 'CASCADE' })
  comment: Comment[];
}
