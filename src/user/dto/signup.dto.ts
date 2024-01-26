import { IsOptional, IsString } from 'class-validator';

export class SignupDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  profile?: string;
}
