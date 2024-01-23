import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from './entities/follow.entity';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Post } from 'src/post/entities/post.entity';
import { PostService } from 'src/post/post.service';
import { PostLike } from 'src/like/entities/like.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Post, Follow, PostLike]),
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
  controllers: [FollowController],
  providers: [FollowService, UserService, PostService],
})
export class FollowModule {}
