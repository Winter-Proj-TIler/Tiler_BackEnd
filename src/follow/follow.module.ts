import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from './entities/follow.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { PostService } from 'src/post/post.service';
import { User } from 'src/user/entities/user.entity';
import { Post } from 'src/post/entities/post.entity';
import { PostLike } from 'src/like/entities/like.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Follow, User, Post, PostLike]),
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
