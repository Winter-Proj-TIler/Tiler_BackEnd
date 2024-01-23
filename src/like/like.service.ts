import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { Post } from 'src/post/entities/post.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like) private likeEntity: Repository<Like>,
    @InjectRepository(Post) private postEntity: Repository<Post>,
    private readonly userService: UserService,
  ) {}

  async addLike(token: string, postId: number) {
    const thisUser = await this.userService.validateAccess(token);

    const post = await this.postEntity.findOneBy({ postId });
    if (!post) throw new NotFoundException('찾을 수 없는 게시물');

    const like = await this.likeEntity.findOneBy({ userId: thisUser.userId, postId });
    if (like) throw new ConflictException('이미 존재하는 좋아요 데이터');

    await this.likeEntity.save({
      userId: thisUser.userId,
      postId,
    });
  }

  async deleteLike(token: string, postId: number) {
    const thisUser = await this.userService.validateAccess(token);

    const post = await this.postEntity.findOneBy({ postId });
    if (!post) throw new NotFoundException('존재하지 않는 게시물');

    const like = await this.likeEntity.findOneBy({ userId: thisUser.userId, postId });
    if (!like) throw new NotFoundException('존재하지 않는 좋아요 데이터');

    await this.likeEntity.delete({
      userId: thisUser.userId,
      postId,
    });
  }
}
