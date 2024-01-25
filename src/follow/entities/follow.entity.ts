import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';

@Entity()
export class Follow {
  @PrimaryGeneratedColumn()
  followId: number;

  @RelationId((follow: Follow) => follow.follower)
  followerId: number;

  @RelationId((follow: Follow) => follow.following)
  followingId: number;

  @ManyToOne(() => User, (user) => user.follower, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'followerId' })
  follower: User;

  @ManyToOne(() => User, (user) => user.following, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'followingId' })
  following: User;
}
