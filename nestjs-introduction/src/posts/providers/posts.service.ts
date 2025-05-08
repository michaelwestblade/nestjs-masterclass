import { Injectable } from '@nestjs/common';
import { GetPostsDto } from '../dtos/get-posts.dto';
import { GetPostDto } from '../dtos/get-post.dto';
import { UsersService } from '../../users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { PatchPostDto } from '../dtos/patch-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly usersService: UsersService) {}
  findAll(getPostsDto: GetPostsDto) {
    const user = this.usersService.findOne({ id: getPostsDto.userId });
    return [
      {
        user,
        title: 'Test Title',
        content: 'lorem ipsum',
      },
      {
        title: 'Test Title 2',
        content: 'lorem ipsum',
      },
    ];
  }

  findOne(getPostDto: GetPostDto) {
    return {
      title: 'Test Title',
      content: 'lorem ipsum',
    };
  }

  createOne(createPostDto: CreatePostDto) {
    return {
      title: 'Test Title',
      content: 'lorem ipsum',
    };
  }

  updatePost(id: string, patchPostDto: PatchPostDto) {
    return {
      title: 'Test Title',
      content: 'lorem ipsum',
    };
  }
}
