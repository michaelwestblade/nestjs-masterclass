import { Injectable } from '@nestjs/common';
import { GetPostsDto } from '../dtos/get-posts.dto';
import { GetPostDto } from '../dtos/get-post.dto';
import { UsersService } from '../../users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '../entities/post.entity';
import { MetaOptionsService } from '../../meta-options/providers/meta-options.service';
import { MetaOptionEntity } from '../../meta-options/entities/meta-option.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>,
    private readonly metaOptionsService: MetaOptionsService,
  ) {}

  /**
   * find all posts
   * @param getPostsDto
   */
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

  /**
   * find one post
   * @param getPostDto
   */
  findOne(getPostDto: GetPostDto) {
    return {
      title: 'Test Title',
      content: 'lorem ipsum',
    };
  }

  /**
   * create posts
   * @param createPostDto
   */
  async create(createPostDto: CreatePostDto) {
    const postObject = {
      title: createPostDto.title,
      content: createPostDto.content,
      slug: createPostDto.slug,
      status: createPostDto.status,
      schema: createPostDto.schema,
      featuredImageUrl: createPostDto.featuredImageUrl,
    } as PostEntity;
    let metaOptions: MetaOptionEntity | null;

    if (createPostDto.metaOptions?.metaValue) {
      metaOptions = await this.metaOptionsService.createPostMetaOptions({
        metaValue: createPostDto.metaOptions?.metaValue || '',
      });
      postObject.metaOptions = metaOptions;
    }

    const post = this.postsRepository.create(postObject);

    return this.postsRepository.save(post);
  }

  /**
   * update a post
   * @param id
   * @param patchPostDto
   */
  update(id: number, patchPostDto: PatchPostDto) {
    return {
      title: 'Test Title',
      content: 'lorem ipsum',
    };
  }

  /**
   * delete a post
   * @param id
   */
  delete(id: number) {
    return true;
  }
}
