import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class GetPostDto {
  @IsInt()
  @Type(() => Number)
  id: number;
}
