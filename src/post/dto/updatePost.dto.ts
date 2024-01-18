import { IsArray, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  title: string;

  @IsString()
  contents: string;

  @IsArray()
  tags: Array<string>;
}
