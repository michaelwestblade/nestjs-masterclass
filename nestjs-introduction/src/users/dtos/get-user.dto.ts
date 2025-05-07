import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class GetUserDto {
  @IsInt()
  @Type(() => Number)
  id: number;
}
