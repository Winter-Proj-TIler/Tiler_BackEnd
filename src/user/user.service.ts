import { ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { UserPayloadDto } from './dto/userPayload.dto';
import { JwtService } from '@nestjs/jwt';
import { Redis } from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    @InjectRepository(User) private userEntity: Repository<User>,
    private jwt: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<Object> {
    const { username, password } = loginDto;

    const thisUser = await this.userEntity.findOneBy({ username });
    if (!thisUser) throw new NotFoundException('존재하지 않는 유저');

    const isMatch = bcrypt.compare(password, thisUser.password);
    if (!isMatch) throw new ForbiddenException('비밀번호가 맞지 않음');

    const payload = { userId: thisUser.userId };
    const accessToken = await this.createAccess(payload);
    const refreshToken = await this.createRefresh(payload);

    await this.redis.set(`${thisUser.userId}Access`, accessToken);
    await this.redis.set(`${thisUser.userId}Refresh`, refreshToken);

    return {
      profileImg: thisUser.profileImg,
      username: thisUser.username,
      accessToken,
      refreshToken,
    };
  }

  async createAccess(payload: UserPayloadDto): Promise<string> {
    const accessToken = await this.jwt.sign(payload, {
      secret: process.env.JWT_SECRET_ACCESS,
      expiresIn: '3h',
    });

    return accessToken;
  }

  async createRefresh(payload: UserPayloadDto): Promise<string> {
    const refreshToken = await this.jwt.sign(payload, {
      secret: process.env.JWT_SECRET_REFRESH,
      expiresIn: '48h',
    });

    return refreshToken;
  }

  async validateAccess(token: string): Promise<UserPayloadDto> {
    token = token.split(' ')[1];

    const data = await this.jwt.verify(token, {
      secret: process.env.JWT_SECRET_ACCESS,
    });

    if (!data) throw new UnauthorizedException('리프레시 토큰 검증해주세요');

    return data;
  }

  async validateRefresh(token: string): Promise<Object> {
    token = token.split(' ')[1];

    const data = await this.jwt.verify(token, {
      secret: process.env.JWT_SECRET_ACCESS,
    });

    if (!data) throw new UnauthorizedException('재로그인 필요');

    const accessToken = await this.createAccess(data);
    const refreshToken = await this.createRefresh(data);

    return { accessToken, refreshToken };
  }
}
