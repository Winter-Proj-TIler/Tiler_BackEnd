import { IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  contents: string;
}
