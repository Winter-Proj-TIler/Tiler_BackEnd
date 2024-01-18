import { IsArray, IsString } from 'class-validator';

export class createPostDto {
  @IsString()
  title: string;

  @IsString()
  contents: string;

  @IsArray()
  tags: Array<string>;
}
