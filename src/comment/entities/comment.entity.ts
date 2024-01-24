import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  commentId: number;

  @Column({ nullable: false })
  @ManyToOne(() => Post, (post) => post.postId)
  postId: number;

  @Column({ nullable: false })
  @ManyToOne(() => User, (user) => user.userId)
  userId: number;

  @Column({ type: 'longtext', nullable: false })
  contents: string;
}
