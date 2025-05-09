import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MetaOptionEntity } from '../entities/meta-option.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MetaOptionsService {
  constructor(
    @InjectRepository(MetaOptionEntity)
    private readonly metaOptionsRepository: Repository<MetaOptionEntity>,
  ) {}
}
