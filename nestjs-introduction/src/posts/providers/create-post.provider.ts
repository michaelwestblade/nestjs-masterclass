import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from '../entities/post.entity';
import { Repository } from 'typeorm';
import { TagsService } from '../../tags/providers/tags.service';
import { ActiveUserInterface } from '../../auth/interfaces/active-user.interfaced';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UserEntity } from '../../users/entities/user.entity';
import { TagEntity } from '../../tags/entities/tag.entity';

@Injectable()
export class CreatePostProvider {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>,
    private readonly tagsService: TagsService,
  ) {}

  /**
   * create posts
   * @param activeUser
   * @param createPostDto
   */
  async create(activeUser: ActiveUserInterface, createPostDto: CreatePostDto) {
    let author: UserEntity;
    let tags: TagEntity[];
    try {
      author = await this.usersService.findOne({ id: activeUser.sub });

      tags = await this.tagsService.findManyById(createPostDto.tags || []);
    } catch (error) {
      throw new ConflictException(error, {
        description: 'error fetching author and tags',
      });
    }

    if (createPostDto.tags?.length !== tags.length) {
      throw new BadRequestException('Please check tag ids');
    }

    const post = this.postsRepository.create({
      ...createPostDto,
      tags,
      author,
    });

    try {
      return this.postsRepository.save(post);
    } catch (error) {
      throw new ConflictException(error, { description: 'error saving post' });
    }
  }
}
