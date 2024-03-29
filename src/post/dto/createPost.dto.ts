import { IsArray, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  contents: string;

  @IsArray()
  tags: Array<string>;
}
