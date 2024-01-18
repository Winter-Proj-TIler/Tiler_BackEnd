import { IsNumber } from 'class-validator';

export class UserPayloadDto {
  @IsNumber()
  userId: number;
}
