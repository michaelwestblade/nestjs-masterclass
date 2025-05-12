import { IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class GetPostDto {
  @IsUUID()
  id: string;
}
