import { IsDate, IsOptional, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../common/pagination/dtos/pagination-query.dto';
import { IntersectionType } from '@nestjs/swagger';

class GetPostsDtoBase {
  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsDate()
  @IsOptional()
  startDate?: Date;

  @IsDate()
  @IsOptional()
  endDate?: Date;
}

export class GetPostsDto extends IntersectionType(
  GetPostsDtoBase,
  PaginationQueryDto,
) {}
