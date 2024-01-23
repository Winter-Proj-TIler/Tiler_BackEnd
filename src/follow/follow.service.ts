import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from './entities/follow.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow) private followEntity: Repository<Follow>,
    @InjectRepository(User) private userEntity: Repository<User>,
    private readonly userService: UserService,
  ) {}

  async addFollow(userId: number, token: string) {
    const thisUser = await this.userService.validateAccess(token);
    const user = await this.userEntity.findOneBy({ userId: thisUser.userId });

    const followTarget = await this.userEntity.findOneBy({ userId });
    if (!followTarget) throw new NotFoundException('존재하지 않는 유저에게 팔로잉 시도를 했습니다.');

    const follow = await this.followEntity.findOneBy({ follower: user.userId, following: userId });
    if (follow) throw new ConflictException('이미 해당 유저를 팔로잉 중입니다.');

    await this.followEntity.save({
      follower: user.userId,
      following: followTarget.userId,
    });
  }

  async unFollow(userId: number, token: string) {
    const thisUser = await this.userService.validateAccess(token);
    const user = await this.userEntity.findOneBy({ userId: thisUser.userId });

    const followTarget = await this.userEntity.findOneBy({ userId });
    if (!followTarget) throw new NotFoundException('존재하지 않는 유저');

    const follow = await this.followEntity.findOneBy({ follower: user.userId, following: userId });
    if (!follow) throw new NotFoundException('존재하지 않는 팔로잉 관계');

    await this.followEntity.delete({
      follower: user.userId,
      following: followTarget.userId,
    });
  }
}
