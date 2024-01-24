import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { User } from 'src/user/entities/user.entity';
import { Post } from 'src/post/entities/post.entity';
import { PostLike } from 'src/like/entities/like.entity';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Comment } from './entities/comment.entity';
import { PostService } from 'src/post/post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Post, PostLike, Comment]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '3h',
      },
      verifyOptions: {
        complete: false,
      },
    }),
  ],
  controllers: [CommentController],
  providers: [CommentService, UserService, PostService],
})
export class CommentModule {}
