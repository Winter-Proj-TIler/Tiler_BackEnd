import { configDotenv } from 'dotenv';
import { Comment } from 'src/comment/entities/comment.entity';
import { PostLike } from 'src/like/entities/like.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from 'typeorm';

configDotenv();

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  postId: number;

  @Column({ nullable: false })
  @RelationId((post: Post) => post.user)
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

  @ManyToOne(() => User, (user) => user.post, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => PostLike, (like) => like.post, { onDelete: 'CASCADE' })
  like: PostLike[];

  @OneToMany(() => Comment, (comment) => comment.post, { onDelete: 'CASCADE' })
  comment: Comment[];
}
