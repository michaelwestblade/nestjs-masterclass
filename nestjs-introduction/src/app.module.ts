import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as process from 'node:process';
import { UserEntity } from './users/entities/user.entity';
import { PostEntity } from './posts/entities/post.entity';
import { TagsModule } from './tags/tags.module';
import { MetaOptionsModule } from './meta-options/meta-options.module';
import { MetaOptionEntity } from './meta-options/entities/meta-option.entity';
import { TagEntity } from './tags/entities/tag.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import environmentValidation from './config/environment.validation';

const env = process.env.NODE_ENV || 'development';

@Module({
  imports: [
    UsersModule,
    PostsModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${env}`,
      load: [appConfig, databaseConfig],
      validationSchema: environmentValidation,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.get('database.host'),
          username: config.get('database.username'),
          password: config.get('database.password'),
          database: config.get('database.name'),
          port: config.get('database.port'),
          synchronize: config.get('database.synchronize'),
          entities: [UserEntity, PostEntity, TagEntity, MetaOptionEntity],
          autoLoadEntities: config.get('database.autoLoadEntities'),
        };
      },
    }),
    ConfigModule,
    TagsModule,
    MetaOptionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
