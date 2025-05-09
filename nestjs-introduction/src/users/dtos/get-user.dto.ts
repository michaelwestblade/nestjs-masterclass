import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserDto {
  @ApiProperty({
    description: 'Get user with a specific id',
    example: 12345,
  })
  @IsString()
  @IsUUID()
  id: string;
}
