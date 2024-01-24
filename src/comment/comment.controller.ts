import { Body, Controller, Delete, Headers, Param, Patch, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/createComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/:postId')
  async createComment(@Param('postId') postId: number, @Headers('Authorization') token: string, @Body() createCommentDto: CreateCommentDto) {
    await this.commentService.createComment(postId, token, createCommentDto);

    return Object.assign({
      stalusCode: 201,
      message: '댓글 생성 성공',
    });
  }

  @Delete('/:commentId')
  async deleteComment(@Param('commentId') commentId: number, @Headers('Authorization') token: string) {
    await this.commentService.deleteComment(commentId, token);

    return Object.assign({
      stalusCode: 204,
      message: '',
    });
  }

  @Patch('/:commentId')
  async updateComment(@Param('commentId') commentId: number, @Headers('Authorization') token: string, @Body() updateCommentDto: UpdateCommentDto) {
    await this.commentService.updateComment(commentId, token, updateCommentDto);

    return Object.assign({
      stalusCode: 200,
      message: '댓글 수정 성공',
    });
  }
}
