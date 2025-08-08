import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { config } from 'aws-sdk';

export function appCreate(app: INestApplication) {
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
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS Masterclass - Blog API')
    .setDescription('Blog API')
    .setTermsOfService('http://localhost:3000/terms-of-service')
    .setLicense('MIT', 'http://localhost:3000/license')
    .addServer('http://localhost:3000')
    .setVersion('1.0')
    .build();

  // instantiate document object
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  // setup aws sdk
  const configService = app.get(ConfigService);

  const awsRegion = configService.get('awsRegion');
  const awsAccessKeyId = configService.get('awsAccessKeyId');
  const awsSecretAccessKey = configService.get('awsSecretAccessKey');

  config.update({
    credentials: {
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey,
    },
    region: awsRegion,
  });

  // CORS
  app.enableCors({});

  return app;
}
