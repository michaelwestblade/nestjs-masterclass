import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { ConfigService } from '@nestjs/config';
import { dropDatabaseHelper } from '../helpers/drop-database.helper';
import { bootstrapNestApplication } from '../helpers/bootstrap-nest-application.helper';
import {
  completeUser,
  missingEmail,
  missingFirstName,
  missingLastName,
} from './users.post.e2e-spec.sample-data';

describe('[Users] @Post endpoints', () => {
  let app: INestApplication<App>;
  let configService: ConfigService;
  let httpServer: App;

  beforeEach(async () => {
    app = await bootstrapNestApplication();
    configService = app.get<ConfigService>(ConfigService);
    httpServer = app.getHttpServer();
  });

  afterEach(async () => {
    await dropDatabaseHelper(configService);
    await app.close();
  });

  it('/users - Endpoint is public', () => {
    return request(httpServer)
      .post('/users')
      .send({})
      .expect(400)
      .then((res) => {
        console.log(res.body);
      });
  });
  it('/users - firstName is required', () => {
    return request(httpServer)
      .post('/users')
      .send(missingFirstName)
      .expect(400);
  });

  it('/users - email is required', () => {
    return request(httpServer).post('/users').send(missingEmail).expect(400);
  });
  it('/users - valid request successfully created a user', () => {
    return request(httpServer)
      .post('/users')
      .send(completeUser)
      .expect(201)
      .then(({ body }) => {
        expect(body).toBeDefined();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(body?.data).toBeDefined();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(body?.data?.firstName).toBe(completeUser.firstName);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(body?.data?.lastName).toBe(completeUser.lastName);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(body?.data?.email).toBe(completeUser.email);
      });
  });
  it('/users - password is not returned in the response', () => {
    return request(httpServer)
      .post('/users')
      .send(completeUser)
      .expect(201)
      .then(({ body }) => {
        expect(body).toBeDefined();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(body?.data).toBeDefined();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(body?.data?.password).not.toBeDefined();
      });
  });
  it('/users - googleId is not returned in the response', () => {
    return request(httpServer)
      .post('/users')
      .send(completeUser)
      .expect(201)
      .then(({ body }) => {
        expect(body).toBeDefined();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(body?.data).toBeDefined();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(body?.data?.googleId).not.toBeDefined();
      });
  });
});
