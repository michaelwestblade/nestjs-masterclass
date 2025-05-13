import { IsUUID } from 'class-validator';

export class GetPostDto {
  @IsUUID()
  id: string;
}
