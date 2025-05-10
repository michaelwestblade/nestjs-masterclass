import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MetaOptionEntity } from '../entities/meta-option.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostMetaOptionsDto } from '../dtos/create-post-meta-options.dto';

@Injectable()
export class MetaOptionsService {
  constructor(
    @InjectRepository(MetaOptionEntity)
    private readonly metaOptionsRepository: Repository<MetaOptionEntity>,
  ) {}

  async createPostMetaOptions(
    createPostMetaOptionsDto: CreatePostMetaOptionsDto,
  ) {
    const metaOption = this.metaOptionsRepository.create(
      createPostMetaOptionsDto,
    );

    return this.metaOptionsRepository.save(metaOption);
  }

  async delete(id: string) {
    return this.metaOptionsRepository.delete(id);
  }
}
