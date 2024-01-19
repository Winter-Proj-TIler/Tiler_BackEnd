import { IsString } from 'class-validator';

export class UpdateInfoDto {
  @IsString()
  username: string;

  @IsString()
  statusMsg: string;
}
