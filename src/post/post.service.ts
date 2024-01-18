import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { UserService } from 'src/user/user.service';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postEntity: Repository<Post>,
    private readonly userService: UserService,
  ) {}

  async searchByKeyword(keyword: string, sort: string) {
    const posts = await this.postEntity.find({ where: [{ title: Like(`%${keyword}%`) }, { contents: Like(`%${keyword}%`) }] });
    if (sort == 'DESC') posts.reverse();

    return posts;
  }

  async searchByTag(tag: string, sort: string) {
    const posts = await this.postEntity.find({ where: { tags: Like(`%,${tag},%`) } });
    if (sort == 'DESC') posts.reverse();

    return posts;
  }

  async createPost(token: string, postDto: CreatePostDto) {
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

  async getPost(postId: number) {
    const thisPost = await this.postEntity.findOneBy({ postId });
    if (!thisPost) throw new NotFoundException('존재하지 않는 게시물');

    const tags = thisPost.tags.split(',').filter((a) => a !== '');

    return {
      postId,
      userId: thisPost.userId,
      title: thisPost.title,
      contents: thisPost.contents,
      writer: thisPost.writer,
      mainImg: thisPost.mainImg,
      tags,
      commentCnt: thisPost.commentCnt,
      likeCnt: thisPost.likeCnt,
      createdAt: thisPost.createdAt,
    };
  }

  async updatePost(postId: number, token: string, postDto: UpdatePostDto) {
    const { tags, title, contents } = postDto;

    const decoded = await this.userService.validateAccess(token);
    const thisPost = await this.postEntity.findOneBy({ postId });

    if (!thisPost) throw new NotFoundException('존재하지 않는 계시물');
    if (thisPost.userId !== decoded.userId) throw new ForbiddenException('권한 없는 유저');

    await this.postEntity.update(postId, {
      title,
      contents,
      tags: ',' + tags.join(',') + ',', // 태그로 검색시 구별하기 위해 구분자로 구분
    });
  }

  async deletePost(postId: number, token: string) {
    const decoded = await this.userService.validateAccess(token);
    const thisPost = await this.postEntity.findOneBy({ postId });

    if (!thisPost) throw new NotFoundException('찾을 수 없는 게시물');
    if (thisPost.userId !== decoded.userId) throw new ForbiddenException('권한 없는 유저');

    await this.postEntity.delete({ postId });
  }
}
