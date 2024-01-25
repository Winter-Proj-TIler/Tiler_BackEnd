import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';

@Entity()
export class PostLike {
  @PrimaryGeneratedColumn()
  likeId: number;

  @Column()
  @RelationId((like: PostLike) => like.user)
  userId: number;

  @Column()
  @RelationId((like: PostLike) => like.post)
  postId: number;

  @ManyToOne(() => User, (user) => user.like, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Post, (post) => post.like, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Post;
}
