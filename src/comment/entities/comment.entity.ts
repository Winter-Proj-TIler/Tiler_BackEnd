import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  commentId: number;

  @Column({ nullable: false })
  @ManyToOne(() => Post, (post) => post.postId)
  @JoinColumn({ name: 'postId' })
  postId: number;

  @Column({ nullable: false })
  @ManyToOne(() => User, (user) => user.userId)
  @JoinColumn({ name: 'userId' })
  userId: number;

  @Column({ type: 'longtext', nullable: false })
  contents: string;
}
