import { Injectable } from '@nestjs/common';
import { GetPostsDto } from '../dtos/get-posts.dto';
import { GetPostDto } from '../dtos/get-post.dto';

@Injectable()
export class PostsService {
  findAll(getPostsDto: GetPostsDto) {
    return [];
  }

  findOne(getPostDto: GetPostDto) {
    return {};
  }
}
