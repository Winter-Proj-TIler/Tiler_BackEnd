import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Follow } from './entities/follow.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(User) private userEntity: Repository<User>,
    @InjectRepository(Follow) private followEntity: Repository<Follow>,
    private readonly userService: UserService,
  ) {}

  async addFollow(userId: number, token: string) {
    //JWT 유효성 검증
    const user = await this.userService.validateAccess(token);

    // 팔로우 대상과 자기 자신의 데이터 찾기
    const follower = await this.userEntity.findOneBy({ userId: user.userId });
    const following = await this.userEntity.findOneBy({ userId });

    // 팔로우 대상이 존재하지 않을 시
    if (!following) throw new NotFoundException('존재하지 않는 유저에게 팔로우 시도');

    // 해당 팔로우 데이터가 이미 존재할 시
    const followData = await this.followEntity.findOneBy({ follower: follower.userId, following: following.userId });
    if (followData) throw new ConflictException('이미 존재하는 팔로우 관계');

    await this.followEntity.save({ follower: follower.userId, following: following.userId });
  }

  async unFollow(userId: number, token: string) {
    // JWT 유효성 검증
    const user = await this.userService.validateAccess(token);

    // 자기 자신과 팔로우 대상 찾기
    const follower = await this.userEntity.findOneBy({ userId: user.userId });
    const following = await this.userEntity.findOneBy({ userId });

    // 팔로우 대상이 존재하지 않는 유저일 경우
    if (!following) throw new NotFoundException('존재하지 않는 유저');

    // 팔로우 데이터 검색
    const followData = await this.followEntity.findOneBy({ follower: follower.userId, following: following.userId });

    // 만약 해당 팔로우 데이터가 존재하지 않는다면
    if (!followData) throw new NotFoundException('존재하지 않는 팔로우 데이터');

    await this.followEntity.delete({ follower: follower.userId, following: following.userId });
  }

  async getFollowList(token: string) {
    const { userId } = await this.userService.validateAccess(token);
    const user = await this.userEntity.findOneBy({ userId });

    // 데이터 기반으로 리스트를 찾고, follower만 리턴할 수 있도록 데이터 가공
    const followingList = await this.followEntity.findBy({ follower: user.userId });
    console.log(followingList);
    const result = await Promise.all(
      followingList.map(async (followData) => {
        const followingUser = await this.userEntity.findOneBy({ userId: followData.follower });
        delete followingUser.password;
        return followingUser;
      }),
    );

    return result;
  }
}
