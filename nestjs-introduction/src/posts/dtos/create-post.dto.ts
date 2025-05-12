import { PostType } from '../enums/postType.enum';
import { PostStatus } from '../enums/postStatus.enum';
import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreatePostMetaOptionsDto } from '../../meta-options/dtos/create-post-meta-options.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TagEntity } from '../../tags/entities/tag.entity';

export class CreatePostDto {
  @ApiProperty({
    description: 'This is the title of the blog post',
    example: 'How to do a thing',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(512)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: `The type of the post (${Object.values(PostType).join(', ')})`,
    enum: PostType,
    example: PostType.POST,
  })
  @IsEnum(PostType)
  @IsNotEmpty()
  postType: PostType;

  @ApiProperty({
    description: 'a url safe title',
    example: 'how-to-do-a-thing',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'A slug should be all small letters and uses only "-" and without spaces. For example "my-url"',
  })
  slug: string;

  @ApiProperty({
    description: `The status of the post (${Object.values(PostStatus).join(', ')})`,
    enum: PostStatus,
    example: PostStatus.PUBLISHED,
  })
  @IsEnum(PostStatus)
  @IsNotEmpty()
  status: PostStatus;

  @ApiPropertyOptional({
    description: 'The content of the post',
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description: 'the json schema of the post (must be json serializable)',
    example:
      '{\r\n    "@context": "https:\/\/schema.org",\r\n    "@type": "Person"\r\n  }',
  })
  @IsString()
  @IsJSON()
  @IsOptional()
  schema?: string;

  @ApiPropertyOptional({
    description: 'featured image for the blog post',
    example: 'http://example.com/images/image.png',
  })
  @IsString()
  @MaxLength(1024)
  @IsOptional()
  featuredImageUrl?: string;

  @ApiPropertyOptional({
    description: 'When to publish the post',
    example: '2024-03-16T07:46:32+0000',
  })
  @IsISO8601()
  @IsOptional()
  publishOn?: string;

  @ApiPropertyOptional({
    description: 'Array of tag ids passed as strings',
    example: [
      'b56f7976-4c52-460b-bc18-78856a748bea',
      '626121fd-35c5-4642-9219-aaf933af1b7c',
    ],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @MinLength(3, { each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: false,
    items: {
      type: 'object',
      properties: {
        metaValue: {
          type: 'json',
          description: 'metaValue is a JSON string of metaOptions',
          example: '{"sideBarEnabled": true}',
        },
      },
    },
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions?: CreatePostMetaOptionsDto | null;

  @ApiProperty({
    description: 'The author of the post',
    example: '715600a5-af74-4eb9-9287-8dc68adddb49',
  })
  @IsUUID()
  @IsNotEmpty()
  authorId: string;
}
