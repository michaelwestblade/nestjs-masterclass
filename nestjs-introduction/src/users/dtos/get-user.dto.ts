import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserDto {
  @ApiProperty({
    description: 'Get user with a specific id',
    example: 12345,
  })
  @IsInt()
  @Type(() => Number)
  id: number;
}
