import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class PostLike {
  @PrimaryColumn()
  @OneToOne(() => User, (user) => user.userId)
  @JoinColumn({ name: 'userId' })
  userId: number;

  @PrimaryColumn()
  @OneToOne(() => Post, (post) => post.postId)
  @JoinColumn({ name: 'postId' })
  postId: number;
}
