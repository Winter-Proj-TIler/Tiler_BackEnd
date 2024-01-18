import { Body, Controller, Headers, Post } from '@nestjs/common';
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
}
