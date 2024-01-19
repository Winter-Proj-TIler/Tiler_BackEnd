import { Body, Controller, Delete, Get, Headers, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { FindPW } from './dto/findPW.dto';
import { UpdatePWDto } from './dto/updatePW.dto';
import { UpdateEmailDto } from './dto/updateEmail.dto';
import { UpdateInfoDto } from './dto/updateInfo.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    const data = await this.userService.login(loginDto);

    return Object.assign({
      status: 200,
      message: '요청에 성공했습니다',
      data,
    });
  }

  @Post('/refresh')
  async validateRefresh(@Headers('Authorization') token: string) {
    const tokens = await this.userService.validateRefresh(token);

    return Object.assign({
      status: 200,
      message: '요청에 성공했습니다',
      tokens,
    });
  }

  @Post('/signup')
  async signup(@Body() signupDto: SignupDto) {
    await this.userService.signUp(signupDto);

    return Object.assign({
      statusCode: 201,
      message: '유저 생성 성공',
    });
  }

  @Delete('/')
  async deleteAcc(@Headers('Authorization') token: string) {
    await this.userService.deleteAcc(token);

    return Object.assign({
      statusCode: 204,
    });
  }

  @Get('/info/:userId')
  async getInfo(@Param('userId') userId: number) {
    const data = await this.userService.getInfo(userId);

    return Object.assign({
      statusCode: 200,
      message: '조회에 성공했스므니다',
      data,
    });
  }
