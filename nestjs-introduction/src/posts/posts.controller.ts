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
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { ActiveUserInterface } from '../auth/interfaces/active-user.interfaced';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  /**
   * get all posts with filters
   * @param getPostsDto
   * @param activeUser
   */
  @Get()
  public getPosts(
    @Query() getPostsDto: GetPostsDto,
    @ActiveUser() activeUser: ActiveUserInterface,
  ) {
    return this.postService.findAll(activeUser, getPostsDto);
  }

  /**
   * get a single post by ID
   * @param getPostDto
   */
  @Get(':id')
  public getPost(@Param() getPostDto: GetPostDto) {
    return this.postService.findOne(getPostDto);
  }

  /**
   * create a post
   * @param createPostDto
   * @param activeUser
   */
  @ApiOperation({ summary: 'Create post' })
  @ApiResponse({
    status: 201,
    description: '201 if post was created successfully',
  })
  @Post()
  public createPost(
    @Body() createPostDto: CreatePostDto,
    @ActiveUser() activeUser: ActiveUserInterface,
  ) {
    return this.postService.create(activeUser, createPostDto);
  }

  /**
   * update a post by ID
   * @param id
   * @param patchPostDto
   */
  @Patch(':id')
  @ApiProperty({
    name: 'id',
    description: 'id of the post to update',
  })
  @ApiResponse({
    status: 200,
    description: 'post was updated successfully',
  })
  public updatePost(
    @Param('id') id: string,
    @Body() patchPostDto: PatchPostDto,
  ) {
    return this.postService.update(id, patchPostDto);
  }

  /**
   * delete a post by id
   * @param id
   */
  @ApiResponse({
    status: 200,
    description: 'post was deleted successfully',
  })
  @Delete(':id')
  public deletePost(@Param('id') id: string) {
    return this.postService.delete(id);
  }
}
