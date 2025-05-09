import { IsInt, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class GetPostsDto {
  @IsInt()
  @Type(() => Number)
  limit: number;
  @IsInt()
  @Type(() => Number)
  page: number;

  @IsUUID()
  userId: string;
}
