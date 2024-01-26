import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios, { AxiosResponse } from 'axios';
import { configDotenv } from 'dotenv';
import { SignupDto } from 'src/user/dto/signup.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

configDotenv();

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userEntity: Repository<User>,
    private readonly userService: UserService,
  ) {}

  async googleLogin(req) {
    const user = await this.userEntity.findOneBy({ email: req.user.email });

    if (!user) {
      // 만약 해당 이메일로 가입된 유저가 없다면 생성하기
      const signupDto: SignupDto = {
        email: req.user.email,
        password: process.env.GOOGLE_LOGIN_PW,
        username: req.user.lastName,
        profile: req.user.picture,
      };
      await this.userService.signUp(signupDto);
    } else {
      // 만약 비밀번호가 다르다면? -> 이미 해당 이메일로 회원가입이 되어있는 유저가 존재
      const isMatch = await bcrypt.compare(process.env.GOOGLE_LOGIN_PW, user.password);
      if (!isMatch) throw new ConflictException('이미 해당 이메일로 가입된 유저가 존재합니다.');
    }

    // 로그인 실시
    const loginData = await this.userService.login({ email: req.user.email, password: process.env.GOOGLE_LOGIN_PW });

    return loginData;
  }

  async githubLogin(code: string) {
    // 접근 허용 Access key 발급
    const getTokenUrl: string = 'https://github.com/login/oauth/access_token';

    // 인증을 위한 자료들 request 객체로 매핑
    const request = {
      code,
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_SECRET,
    };

    // github에 요청 보내기
    const response: AxiosResponse = await axios.post(getTokenUrl, request, {
      headers: {
        Accept: 'application/json',
      },
    });

    // 에러 발생시 실패 오류 발생시키기
    if (response.data.error) throw new UnauthorizedException('깃허브 인증 실패');

    // 깃허브에서 유저 정보 받아오기
    const { access_token } = response.data;

    const getUserUrl: string = 'https://api.github.com/user';

    const { data } = await axios.get(getUserUrl, {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });

    // 만약 유저 이메일이 public이 아닐경우 이메일에 접근 못하는 문제 처리
    if (!data.email) throw new ConflictException('깃허브 이메일을 public으로 바꾼 후 다시 시도해주세요.');

    const user = await this.userEntity.findOneBy({ email: data.email });

    // 만약 해당 이메일로 된 계정이 없다면 생성하기
    if (!user) {
      const signupDto: SignupDto = {
        email: data.email,
        password: process.env.GITHUB_LOGIN_PW,
        username: data.login,
        profile: data.avatar_url,
      };
      await this.userService.signUp(signupDto);
    } else {
      // 만약 비밀번호가 다르다면? -> 이미 해당 이메일로 회원가입이 되어있는 유저가 존재
      const isMatch = await bcrypt.compare(process.env.GITHUB_LOGIN_PW, user.password);
      if (!isMatch) throw new ConflictException('이미 해당 이메일로 가입된 유저가 존재합니다.');
    }

    // 로그인 로직 실행
    const loginData = await this.userService.login({ email: data.email, password: process.env.GITHUB_LOGIN_PW });

    return loginData;
  }
}
