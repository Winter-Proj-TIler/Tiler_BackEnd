import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { createPostDto } from './dto/createPost.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/')
  async createPost(@Headers('Authorization') token: string, @Body() createPostDto: createPostDto) {
    await this.postService.createPost(token, createPostDto);

    return Object.assign({
      statusCode: 201,
      message: '글 게시 성공',
    });
  }

  @Get('/:postId')
  async getPost(@Param('postId') postId: number) {
    const post = await this.postService.getPost(Number(postId));

    return Object.assign({
      statusCode: 200,
      message: '조회 성공',
      post,
    });
  }
}
