import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { UserService } from 'src/user/user.service';
import { createPostDto } from './dto/createPost.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(User) private userEntity: Repository<User>,
    @InjectRepository(Post) private postEntity: Repository<Post>,
    private readonly userService: UserService,
  ) {}

  async createPost(token: string, postDto: createPostDto) {
    const { contents, tags, title } = postDto;

    const writed = await this.userService.validateAccess(token);

    // 현재 시간을 저장
    const today = new Date();
    const now = today.toLocaleString();

    await this.postEntity.save({
      userId: writed.userId,
      title,
      contents,
      writer: writed.username,
      tags: ',' + tags.join(',') + ',', // 태그 검색시 like로 검색하기 위한 처리
      createdAt: now,
    });
  }
}
