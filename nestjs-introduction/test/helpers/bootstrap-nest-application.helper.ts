import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appCreate } from '../../src/app.create';

export async function bootstrapNestApplication(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule, ConfigModule],
    providers: [ConfigService],
  }).compile();

  const app = moduleFixture.createNestApplication();
  const appWithMiddlewares = appCreate(app);
  await appWithMiddlewares.init();

  return appWithMiddlewares;
}
