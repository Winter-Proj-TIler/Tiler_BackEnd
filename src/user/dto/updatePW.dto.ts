import { IsString } from 'class-validator';

export class UpdatePWDto {
  @IsString()
  password: string;
}
