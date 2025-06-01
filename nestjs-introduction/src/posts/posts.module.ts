import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './providers/posts.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { MetaOptionsModule } from '../meta-options/meta-options.module';
import { TagsModule } from '../tags/tags.module';
import { PaginationModule } from '../common/pagination/pagination.module';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([PostEntity]),
    MetaOptionsModule,
    TagsModule,
    PaginationModule,
  ],
})
export class PostsModule {}
