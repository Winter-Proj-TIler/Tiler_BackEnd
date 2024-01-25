import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  commentId: number;

  @Column({ nullable: false })
  @RelationId((comment: Comment) => comment.post)
  postId: number;

  @Column({ nullable: false })
  @RelationId((comment: Comment) => comment.user)
  userId: number;

  @ManyToOne(() => Post, (post) => post.comment, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @ManyToOne(() => User, (user) => user.comment, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'longtext', nullable: false })
  contents: string;
}
