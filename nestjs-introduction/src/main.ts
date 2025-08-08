import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appCreate } from './app.create';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appWithMiddlewares = appCreate(app);

  const port = process.env.PORT ?? 3000;

  await appWithMiddlewares.listen(port, () => {
    console.log(`App running on port ${port}`);
  });
}
bootstrap();
