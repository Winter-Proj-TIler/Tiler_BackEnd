import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { Post } from 'src/post/entities/post.entity';
import { PostService } from 'src/post/post.service';
import { PostLike } from 'src/like/entities/like.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, User, PostLike]),
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
  controllers: [UserController],
  providers: [UserService, PostService],
})
export class UserModule {}
