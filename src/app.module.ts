import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { configDotenv } from 'dotenv';
import { PostModule } from './post/post.module';
import { LikeModule } from './like/like.module';
import { FollowModule } from './follow/follow.module';

configDotenv();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      port: 3306,
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      password: process.env.DB_PW,
      database: process.env.DB_NAME,
      entities: [__dirname + './**/entities/*.ts'],
      timezone: 'Asia/Seoul',
      synchronize: true,
      logging: false,
      autoLoadEntities: true,
    }),
    RedisModule.forRoot({
      readyLog: true,
      config: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PW,
      },
    }),
    UserModule,
    PostModule,
    LikeModule,
    FollowModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
