import { Injectable } from '@nestjs/common';
import { GetPostsDto } from '../dtos/get-posts.dto';
import { GetPostDto } from '../dtos/get-post.dto';
import { UsersService } from '../../users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '../entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>,
  ) {}
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
    const post = this.postsRepository.create({
      title: createPostDto.title,
      content: createPostDto.content,
      slug: createPostDto.slug,
      status: createPostDto.status,
      schema: createPostDto.schema,
      featuredImageUrl: createPostDto.featuredImageUrl,
    });

    return this.postsRepository.save(post);
  }

  updatePost(id: number, patchPostDto: PatchPostDto) {
    return {
      title: 'Test Title',
      content: 'lorem ipsum',
    };
  }

  deletePost(id: number) {
    return true;
  }
}
