import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { GetPostsDto } from './dtos/get-posts.dto';
import { GetPostDto } from './dtos/get-post.dto';
import {
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';
import { PatchPostDto } from './dtos/patch-post.dto';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get()
  public getPosts(@Query() getPostsDto: GetPostsDto) {
    return this.postService.findAll(getPostsDto);
  }

  @Get(':id')
  public getPost(@Param() getPostDto: GetPostDto) {
    return this.postService.findOne(getPostDto);
  }

  @ApiOperation({ summary: 'Create post' })
  @ApiResponse({
    status: 201,
    description: '201 if post was created successfully',
  })
  @Post()
  public createPost(@Body() createPostDto: CreatePostDto) {
    return this.postService.createOne(createPostDto);
  }

  @Patch(':id')
  @ApiProperty({
    name: 'id',
    description: 'id of the post to update',
  })
  @ApiResponse({
    status: 200,
    description: 'post was updated successfully',
  })
  public updatedPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() patchPostDto: PatchPostDto,
  ) {
    return this.postService.updatePost(id, patchPostDto);
  }

  @ApiResponse({
    status: 200,
    description: 'post was deleted successfully',
  })
  @Delete(':id')
  public deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postService.deletePost(id);
  }
}
