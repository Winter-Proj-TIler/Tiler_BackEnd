import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { FindPW } from './dto/findPW.dto';
import { UpdatePWDto } from './dto/updatePW.dto';
import { UpdateEmailDto } from './dto/updateEmail.dto';
import { UpdateInfoDto } from './dto/updateInfo.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Post('/logout')
  async logout(@Headers('Authorization') token: string) {
    await this.userService.logOut(token);

    return Object.assign({
      statusCode: 200,
      message: '로그아웃 성공',
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

  @Patch('/update/info')
  async updateInfo(@Headers('Authorization') token: string, @Body() updateInfoDto: UpdateInfoDto) {
    await this.userService.updateInfo(token, updateInfoDto);

    return Object.assign({
      statusCode: 200,
      statusMsg: '수정 성공',
    });
  }

  @Patch('/update/email')
  async updateEmail(@Headers('Authorization') token: string, @Body() updateEmailDto: UpdateEmailDto) {
    await this.userService.updateEmail(token, updateEmailDto);

    return Object.assign({
      statusCode: 200,
      message: '변경 성공',
    });
  }

  @Patch('/update/password')
  async updatePassword(@Headers('Authorization') token: string, @Body() updatePWDto: UpdatePWDto) {
    await this.userService.updatePassword(token, updatePWDto);

    return Object.assign({
      statusCode: 200,
      message: '변경 성공',
    });
  }

  @Get('/findPW')
  async changePW(@Body() findPWDto: FindPW) {
    await this.userService.changePW(findPWDto);

    return Object.assign({
      statusCode: 200,
      message: '이메일이 전송되었습니다',
    });
  }

  @Patch('/profile')
  @UseInterceptors(FileInterceptor('profile'))
  async uploadProfile(@Headers('Authorization') token: string, @UploadedFile() profile: Express.Multer.File) {
    const url = await this.userService.uploadProfile(token, profile);

    return {
      url,
      statusCode: 200,
      statusMsg: '파일 업로드 성공',
    };
  }

  @Patch('/profile/basic')
  async toBasicProfile(@Headers('Authorization') token: string) {
    await this.userService.toBasicProfile(token);

    return {
      statusCode: 200,
      statusMsg: '기본 이미지 전환 성공',
    };
  }
}
