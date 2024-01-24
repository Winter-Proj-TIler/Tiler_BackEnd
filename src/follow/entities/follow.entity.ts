import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Follow {
  @PrimaryGeneratedColumn()
  followId: number;

  @Column()
  @ManyToOne(() => User, (user) => user.userId)
  @JoinColumn({ name: 'follower' })
  follower: number;

  @Column()
  @ManyToOne(() => User, (user) => user.userId)
  @JoinColumn({ name: 'following' })
  following: number;
}
