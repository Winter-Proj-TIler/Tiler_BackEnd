import { Controller, Get, UseGuards, Req, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    const data = await this.authService.googleLogin(req);

    return Object.assign({
      statusCode: 200,
      message: '구글 로그인 성공',
      data,
    });
  }

  @Get('/github')
  async githubAuth(@Query('code') code: string) {
    const data = await this.authService.githubLogin(code);

    return Object.assign({
      statusCode: 200,
      message: '깃허브 로그인 성공',
      data,
    });
  }
}
