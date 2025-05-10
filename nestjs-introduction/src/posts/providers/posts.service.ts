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
    // const user = this.usersService.findOne({ id: getPostsDto.userId });
    const posts = this.postsRepository.find({
      loadEagerRelations: true,
      relations: ['metaOptions'],
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
    const post = this.postsRepository.create(createPostDto);

    return this.postsRepository.save(post);
  }

  /**
   * update a post
   * @param id
   * @param patchPostDto
   */
  update(id: string, patchPostDto: PatchPostDto) {
    return {
      title: 'Test Title',
      content: 'lorem ipsum',
    };
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
    if (post.metaOptions?.id) {
      await this.metaOptionsService.delete(post.metaOptions?.id);
    }

    return post.id;
  }
}
