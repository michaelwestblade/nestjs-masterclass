import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateTagDto } from './dtos/create-tag.dto';
import { TagsService } from './providers/tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagService: TagsService) {}

  @Get()
  findAll() {
    return this.tagService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagService.findOne(id);
  }

  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.tagService.delete(id);
  }

  @Delete(':id/soft-delete')
  softDelete(@Param('id') id: string) {
    return this.tagService.softDelete(id);
  }
}
