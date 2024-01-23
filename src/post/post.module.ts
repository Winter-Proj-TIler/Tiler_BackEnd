import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { Post } from './entities/post.entity';
import { PostLike } from 'src/like/entities/like.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Post, PostLike]),
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
  controllers: [PostController],
  providers: [PostService, UserService],
})
export class PostModule {}
