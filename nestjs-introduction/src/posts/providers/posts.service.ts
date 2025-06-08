import {
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { GetPostsDto } from '../dtos/get-posts.dto';
import { GetPostDto } from '../dtos/get-post.dto';
import { UsersService } from '../../users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '../entities/post.entity';
import { MetaOptionsService } from '../../meta-options/providers/meta-options.service';
import { TagsService } from '../../tags/providers/tags.service';
import { TagEntity } from '../../tags/entities/tag.entity';
import { PaginationProvider } from '../../common/pagination/providers/pagination.provider';
import { Paginated } from '../../common/pagination/interfaces/paginated.interface';
import { ActiveUserInterface } from '../../auth/interfaces/active-user.interfaced';
import { CreatePostProvider } from './create-post.provider';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>,
    private readonly metaOptionsService: MetaOptionsService,
    private readonly tagsService: TagsService,
    private readonly paginationProvider: PaginationProvider<PostEntity>,
    private readonly createPostsProvider: CreatePostProvider,
  ) {}

  /**
   * find all posts
   * @param getPostsDto
   * @param activeUser
   */
  async findAll(
    activeUser: ActiveUserInterface,
    getPostsDto: GetPostsDto,
  ): Promise<Paginated<PostEntity>> {
    const posts = await this.paginationProvider.paginateQuery(
      {
        limit: getPostsDto.limit,
        page: getPostsDto.page,
      },
      {
        loadEagerRelations: true,
        relations: {
          metaOptions: true,
          author: true,
          tags: true,
        },
        where: {
          author: {
            id: activeUser.sub,
          },
        },
      },
      this.postsRepository,
    );

    return posts;
  }

  /**
   * find one post
   * @param getPostDto
   */
  findOne(getPostDto: GetPostDto) {
    return this.postsRepository.findOne({
      where: { id: getPostDto.id },
      relations: { metaOptions: true, author: true, tags: true },
    });
  }

  /**
   * create posts
   * @param activeUser
   * @param createPostDto
   */
  async create(activeUser: ActiveUserInterface, createPostDto: CreatePostDto) {
    return this.createPostsProvider.create(activeUser, createPostDto);
  }

  /**
   * update a post
   * @param id
   * @param patchPostDto
   */
  async update(id: string, patchPostDto: PatchPostDto) {
    let post: PostEntity | null = null;
    let tags: TagEntity[] | null = null;

    try {
      post = await this.postsRepository.findOne({ where: { id: id } });
    } catch (error: any) {
      throw new RequestTimeoutException('Unable to process request', {
        cause: error,
        description: 'Unable to connect to database',
      });
    }

    if (!post) {
      throw new NotFoundException(`No post with ID ${id} exists`);
    }

    try {
      tags = await this.tagsService.findManyById(patchPostDto.tags || []);
    } catch (error: any) {
      throw new RequestTimeoutException('Unable to process request', {
        cause: error,
        description: 'Unable to connect to database',
      });
    }

    if (tags && tags.length !== patchPostDto.tags?.length) {
      throw new NotFoundException(
        `Couldn't find all tags passed in the request. Tags found: ${tags
          .map((tag) => tag.name)
          .join(',')}`,
      );
    }

    post.title = patchPostDto.title ?? post.title;
    post.content = patchPostDto.content ?? post.content;
    post.tags = patchPostDto.tags ? tags : post.tags;
    post.schema = patchPostDto.schema ?? post.schema;
    post.publishOn = patchPostDto.publishOn ?? post.publishOn;
    post.postType = patchPostDto.postType ?? post.postType;
    post.status = patchPostDto.status ?? post.status;
    post.slug = patchPostDto.slug ?? post.slug;
    post.featuredImageUrl =
      patchPostDto.featuredImageUrl ?? post.featuredImageUrl;

    let updatedPost: PostEntity | null = null;

    try {
      updatedPost = await this.postsRepository.save(post);
    } catch (error: any) {
      throw new RequestTimeoutException('Unable to save post', {
        cause: error,
        description: 'Unable to connect to database',
      });
    }

    return updatedPost;
  }

  /**
   * delete a post
   * @param id
   */
  async delete(id: string) {
    const post = await this.postsRepository.findOne({ where: { id: id } });

    if (!post) {
      throw new NotFoundException(`No post with ID ${id} exists`);
    }

    await this.postsRepository.delete(id);

    return post.id;
  }
}
