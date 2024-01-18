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

    const payload = { userId: thisUser.userId, username };
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

  async signUp(signUpDto: SignupDto) {
    const { username, password, email } = signUpDto;

    const thisUser = await this.userEntity.findOneBy([{ username }, { email }]);
    if (thisUser) throw new ConflictException('이미 가입된 이메일주소 또는 닉네임');

    const hashedPW = await bcrypt.hash(password, 10);

    await this.userEntity.save({
      username,
      password: hashedPW,
      email,
    });
  }

  async deleteAcc(token: string) {
    const user = await this.validateAccess(token);

    await this.userEntity.delete({ userId: user.userId });
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

    try {
      const data = await this.jwt.verify(token, {
        secret: process.env.JWT_SECRET_ACCESS,
      });

      if (!data) throw new UnauthorizedException('리프레시 토큰 검증해주세요');

      return data;
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException('리프레시 토큰 검증 필요');
    }
  }

  async validateRefresh(token: string): Promise<Object> {
    token = token.split(' ')[1];

    try {
      const data = await this.jwt.verify(token, {
        secret: process.env.JWT_SECRET_ACCESS,
      });

      if (!data) throw new UnauthorizedException('재로그인 필요');

      const accessToken = await this.createAccess(data);
      const refreshToken = await this.createRefresh(data);

      return { accessToken, refreshToken };
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException('재로그인 필요');
    }
  }
}
