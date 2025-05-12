import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagEntity } from '../entities/tag.entity';
import { In, Repository } from 'typeorm';
import { CreateTagDto } from '../dtos/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  async create(createTagDto: CreateTagDto) {
    const tag = this.tagRepository.create(createTagDto);

    return this.tagRepository.save(tag);
  }

  findAll() {
    return this.tagRepository.find();
  }

  findManyById(ids: string[]) {
    return this.tagRepository.find({
      where: {
        id: In(ids),
      },
    });
  }

  findOne(id: string) {
    return this.tagRepository.findOne({ where: { id: id } });
  }

  async delete(id: string) {
    return this.tagRepository.delete(id);
  }

  softDelete(id: string) {
    return this.tagRepository.softDelete(id);
  }
}
