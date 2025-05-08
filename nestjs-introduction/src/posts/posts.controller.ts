import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { GetPostsDto } from './dtos/get-posts.dto';
import { GetPostDto } from './dtos/get-post.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';

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

  @Post()
  public createPost(@Body() createPostDto: CreatePostDto) {
    return this.postService.createOne(createPostDto);
  }
}
