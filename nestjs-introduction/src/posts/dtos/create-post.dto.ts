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
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreatePostMetaOptionsDto } from './create-post-meta-options.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'This is the title of the blog post',
    example: 'How to do a thing',
  })
  @IsString()
  @MinLength(4)
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
  @IsOptional()
  featuredImageUrl?: string;

  @ApiPropertyOptional({
    description: 'When to publish the post',
    example: '2024-03-16T07:46:32+0000',
  })
  @IsISO8601()
  @IsOptional()
  publishOn?: Date;

  @ApiPropertyOptional({
    description: 'Array of tags passed as strings',
    example: ['nestJS', 'typescript'],
  })
  @IsArray()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({
    type: 'array',
    required: false,
    items: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          description:
            'The key can be an string identifier for your meta option',
          example: 'sidebarEnabled',
        },
        value: {
          type: 'any',
          description: 'Any value that you want to save to the key',
          example: true,
        },
      },
    },
    description: 'The tags passed as strings',
    example: [
      {
        key: 'sidebarEnabled',
        value: true,
      },
    ],
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions?: CreatePostMetaOptionsDto[];
}
