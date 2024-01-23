import { Controller, Delete, Headers, Param, Post } from '@nestjs/common';
import { FollowService } from './follow.service';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post('/:postId')
  async addFollow(@Param('userId') userId: number, @Headers('Authorization') token: string) {
    await this.followService.addFollow(userId, token);

    return Object.assign({
      statusCode: 200,
      message: '팔로우 신청 성공',
    });
  }

  @Delete('/:postId')
  async unFollow(@Param('userId') userId: number, @Headers('Authorization') token: string) {
    await this.followService.unFollow(userId, token);

    return Object.assign({
      statusCode: 200,
      message: '언팔로우 성공',
    });
  }
}
