import { Controller, Delete, Get, Headers, Param, Post } from '@nestjs/common';
import { FollowService } from './follow.service';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post('/:userId')
  async addFollow(@Param('userId') userId: number, @Headers('Authorization') token: string) {
    await this.followService.addFollow(userId, token);

    return Object.assign({
      statusCode: 200,
      message: '요청 성공',
    });
  }

  @Delete('/:userId')
  async unFollow(@Param('userId') userId: number, @Headers('Authorization') token: string) {
    await this.followService.unFollow(userId, token);

    return Object.assign({
      statusCode: 204,
      message: '요청 성공',
    });
  }

  @Get('/list')
  async getFollowList(@Headers('Authorization') token: string) {
    const list = await this.followService.getFollowList(token);

    return Object.assign({
      statusCode: 200,
      message: '요청 성공',
      list,
    });
  }
}
