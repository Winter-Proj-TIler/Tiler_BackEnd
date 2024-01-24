import { IsString } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  contents: string;
}
