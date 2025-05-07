import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class GetUsersDto {
  @IsInt()
  @Type(() => Number)
  limit: number;
  @IsInt()
  @Type(() => Number)
  page: number;
}
