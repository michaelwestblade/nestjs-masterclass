import { Injectable, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>,
    private readonly metaOptionsService: MetaOptionsService,
    private readonly tagsService: TagsService,
  ) {}

  /**
   * find all posts
   * @param getPostsDto
   */
  findAll(getPostsDto: GetPostsDto) {
    // const user = this.usersService.findOne({ id: getPostsDto.userId });
    const posts = this.postsRepository.find({
      loadEagerRelations: true,
      relations: {
        metaOptions: true,
        author: true,
        tags: true,
      },
    });

    return posts;
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
    const author = await this.usersService.findOne({
      id: createPostDto.authorId,
    });

    if (!author) {
      throw new NotFoundException(
        `No author exists for id ${createPostDto.authorId}`,
      );
    }

    const tags = await this.tagsService.findManyById(createPostDto.tags || []);

    const post = this.postsRepository.create({
      ...createPostDto,
      tags,
      author,
    });

    return this.postsRepository.save(post);
  }

  /**
   * update a post
   * @param id
   * @param patchPostDto
   */
  async update(id: string, patchPostDto: PatchPostDto) {
    const post = await this.postsRepository.findOne({ where: { id: id } });

    if (!post) {
      throw new NotFoundException(`No post with ID ${id} exists`);
    }

    const tags = await this.tagsService.findManyById(patchPostDto.tags || []);

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

    return this.postsRepository.save(post);
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
