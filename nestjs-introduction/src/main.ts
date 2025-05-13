import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // swagger
  const config = new DocumentBuilder()
    .setTitle('NestJS Masterclass - Blog API')
    .setDescription('Blog API')
    .setTermsOfService('http://localhost:3000/terms-of-service')
    .setLicense('MIT', 'http://localhost:3000/license')
    .addServer('http://localhost:3000')
    .setVersion('1.0')
    .build();

  // instantiate document object
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port, () => {
    console.log(`App running on port ${port}`);
  });
}
bootstrap();
