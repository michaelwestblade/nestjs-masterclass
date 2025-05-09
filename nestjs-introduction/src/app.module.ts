import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import * as process from 'node:process';
import { UserEntity } from './users/entities/user.entity';
import { PostEntity } from './posts/entities/post.entity';
import { TagsModule } from './tags/tags.module';
import { MetaOptionsModule } from './meta-options/meta-options.module';

const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432;
const DB_HOST = process.env.DB_HOST || '';
const DB_USER = process.env.DB_USER || '';
const DB_PASS = process.env.DB_PASS || '';
const DB_NAME = process.env.DB_NAME || '';

@Module({
  imports: [
    UsersModule,
    PostsModule,
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: () => ({
        type: 'postgres',
        host: DB_HOST,
        username: DB_USER,
        password: DB_PASS,
        database: DB_NAME,
        port: DB_PORT,
        synchronize: true,
        entities: [UserEntity, PostEntity],
      }),
    }),
    ConfigModule,
    TagsModule,
    MetaOptionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
