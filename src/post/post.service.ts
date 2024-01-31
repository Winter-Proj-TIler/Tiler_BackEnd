import { ForbiddenException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { PostLike } from 'src/like/entities/like.entity';
import { UserService } from 'src/user/user.service';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { Comment } from 'src/comment/entities/comment.entity';
import * as AWS from 'aws-sdk';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postEntity: Repository<Post>,
    @InjectRepository(PostLike) private likeEntity: Repository<PostLike>,
    @InjectRepository(Comment) private commentEntity: Repository<Comment>,
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
  ) {}
  s3 = new AWS.S3({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    },
  });

  async searchByKeyword(keyword: string, sort: string) {
    const posts = await this.postEntity.find({ where: [{ title: Like(`%${keyword}%`) }, { contents: Like(`%${keyword}%`) }] });
    if (sort == 'DESC') posts.reverse();

    const result = await Promise.all(
      posts.map(async (post) => ({
        ...post,
        tags: post.tags.split(',').filter((tag) => tag != ''),
        likeCnt: await this.likeEntity.count({ where: { postId: post.postId } }),
        commentCnt: await this.commentEntity.count({ where: { postId: post.postId } }),
      })),
    );

    return result;
  }

  async searchByTag(tag: string, sort: string) {
    const posts = await this.postEntity.find({ where: { tags: Like(`%,${tag},%`) } });
    if (sort == 'DESC') posts.reverse();

    const result = await Promise.all(
      posts.map(async (post) => ({
        ...post,
        tags: post.tags.split(',').filter((tag) => tag != ''),
        likeCnt: await this.likeEntity.count({ where: { postId: post.postId } }),
        commentCnt: await this.commentEntity.count({ where: { postId: post.postId } }),
      })),
    );

    return result;
  }

  async searchByUserId(userId: number) {
    const posts = await this.postEntity.findBy({ userId });

    const result = await Promise.all(
      posts.map(async (post) => ({
        ...post,
        tags: post.tags.split(',').filter((tag) => tag != ''),
        likeCnt: await this.likeEntity.count({ where: { postId: post.postId } }),
        commentCnt: await this.commentEntity.count({ where: { postId: post.postId } }),
      })),
    );

    return result;
  }

  async createPost(token: string, postDto: CreatePostDto) {
    const { contents, tags, title } = postDto;

    const writed = await this.userService.validateAccess(token);

    // 현재 시간을 저장
    const today = new Date();
    const now = today.toLocaleString();

    // 대표사진 찾기
    const regxp = new RegExp('https?://\\S+.(png|jpg)');
    const picture = regxp.exec(contents);

    await this.postEntity.save({
      userId: writed.userId,
      title,
      contents,
      writer: writed.username,
      tags: ',' + tags.join(',') + ',', // 태그 검색시 like로 검색하기 위한 처리
      createdAt: now,
      mainImg: picture != null ? picture[0] : null,
    });
  }

  async getPost(postId: number) {
    const thisPost = await this.postEntity.findOneBy({ postId });
    if (!thisPost) throw new NotFoundException('존재하지 않는 게시물');

    const tags = thisPost.tags.split(',').filter((a) => a !== '');
    const likeCnt = await this.likeEntity.count({ where: { postId } });
    const comments = await this.commentEntity.findBy({ postId });

    const post = {
      ...thisPost,
      tags,
      likeCnt,
      commentCnt: comments.length,
    };

    return { post, comments };
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

  async uploadImg(file: Express.Multer.File) {
    const param = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: String(Date.now() + file.originalname),
      Body: file.buffer,
      ACL: 'public-read',
    };

    const data = await this.s3.upload(param).promise();

    return data.Location;
  }
}
