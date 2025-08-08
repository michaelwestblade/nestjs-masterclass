import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appCreate } from '../../src/app.create';
import { dropDatabase } from '../helpers/drop-database';

describe('[Users] @Post endpoints', () => {
  let app: INestApplication<App>;
  let configService: ConfigService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, ConfigModule],
      providers: [ConfigService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app = appCreate(app);
    configService = app.get<ConfigService>(ConfigService);
    await app.init();
  });

  afterEach(async () => {
    await dropDatabase(configService);
    await app.close();
  });

  it.todo('/users - Endpoint is public');
  it.todo('/users - firstName is required');
  it.todo('/users - lastName is required');
  it.todo('/users - email is required');
  it.todo('/users - valid request successfully created a user');
  it.todo('/users - password is not returned in the response');
  it.todo('/users - googleId is not returned in the response');
});
