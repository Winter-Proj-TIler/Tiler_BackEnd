import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Follow {
  @PrimaryGeneratedColumn()
  followId: number;

  @ManyToOne(() => User, (user) => user.userId)
  @JoinColumn({ name: 'followerId' })
  follower: number;

  @ManyToOne(() => User, (user) => user.userId)
  @JoinColumn({ name: 'followingId' })
  following: number;
}
