import { IsEmail, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetUsersDto {
  @ApiPropertyOptional({
    description: 'The number of users to return per page',
    example: 20,
  })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'The page of users to return',
    example: 1,
  })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'en email to search on',
    example: 'test@test.net',
  })
  @IsEmail()
  @IsOptional()
  email?: string;
}
