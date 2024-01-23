import { Controller, Delete, Headers, Param, Post } from '@nestjs/common';
import { LikeService } from './like.service';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post('/:postId')
  async addLike(@Param('postId') postId: number, @Headers('Authorization') token: string) {
    await this.likeService.addLike(token, postId);

    return Object.assign({
      statusCode: 200,
      message: '좋아요 등록 성공',
    });
  }

  @Delete('/:postId')
  async deleteLike(@Param('postId') postId: number, @Headers('Authorization') token: string) {
    await this.likeService.deleteLike(token, postId);

    return Object.assign({
      statusCode: 200,
      message: '좋아요 삭제 성공',
    });
  }
}
