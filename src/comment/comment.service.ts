import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/createComment.dto';
import { Comment } from './entities/comment.entity';
import { UpdateCommentDto } from './dto/updateComment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentEntity: Repository<Comment>,
    private readonly userService: UserService,
  ) {}

  async createComment(postId: number, token: string, commentDto: CreateCommentDto) {
    const { contents } = commentDto;

    // JWT 유효성 인증
    const user = await this.userService.validateAccess(token);

    // 댓글 생성
    await this.commentEntity.save({
      userId: user.userId,
      postId,
      contents,
    });
  }

  async deleteComment(commentId: number, token: string) {
    // JWT 유효성 인증
    const { userId } = await this.userService.validateAccess(token);

    // 목표 댓글 탐색
    const comment = await this.commentEntity.findOneBy({ commentId });

    // 만약 목표 댓글이 존재하지 않을시
    if (!comment) throw new NotFoundException('존재하지 않는 댓글');

    // 만약 로그인 된 유저와 댓글을 작성한 유저가 다를시
    if (comment.userId != userId) throw new ForbiddenException('권한 없는 유저');

    await this.commentEntity.delete({ commentId });
  }

  async updateComment(commentId: number, token: string, commentDto: UpdateCommentDto) {
    const { contents } = commentDto;

    // JWT 유효성 인증
    const { userId } = await this.userService.validateAccess(token);

    // 목표 댓글 탐색
    const comment = await this.commentEntity.findOneBy({ commentId });

    // 만약 목표 댓글이 존재하지 않을시
    if (!comment) throw new NotFoundException('존재하지 않는 댓글');

    // 만약 로그인 된 유저와 댓글을 작성한 유저가 다를시
    if (comment.userId != userId) throw new ForbiddenException('권한 없는 유저');

    await this.commentEntity.update({ commentId }, { contents });
  }
}
