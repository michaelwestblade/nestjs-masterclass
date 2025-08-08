import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { UserEntity } from '../../src/users/entities/user.entity';
import { PostEntity } from '../../src/posts/entities/post.entity';
import { TagEntity } from '../../src/tags/entities/tag.entity';
import { MetaOptionEntity } from '../../src/meta-options/entities/meta-option.entity';

export async function dropDatabase(config: ConfigService) {
  // create the connection with datasource
  const appDataSource = new DataSource({
    type: 'postgres',
    host: config.get('database.host'),
    username: config.get('database.username'),
    password: config.get('database.password'),
    database: config.get('database.name'),
    port: config.get('database.port'),
    synchronize: config.get('database.synchronize'),
    entities: [UserEntity, PostEntity, TagEntity, MetaOptionEntity],
  });

  // drop all the tables
  await appDataSource.dropDatabase();

  // close the connection
  await appDataSource.destroy();
}
