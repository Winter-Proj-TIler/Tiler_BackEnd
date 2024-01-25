import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';

@Entity()
export class PostLike {
  @PrimaryGeneratedColumn()
  likeId: number;

  @RelationId((like: PostLike) => like.user)
  userId: number;

  @RelationId((like: PostLike) => like.post)
  postId: number;

  @ManyToOne(() => User, (user) => user.like, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Post, (post) => post.like, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Post;
}
