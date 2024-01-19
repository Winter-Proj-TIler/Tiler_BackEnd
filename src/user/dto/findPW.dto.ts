import { IsString } from 'class-validator';

export class FindPW {
  @IsString()
  email: string;
}
