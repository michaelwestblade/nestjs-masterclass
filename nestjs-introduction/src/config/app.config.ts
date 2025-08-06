import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export default registerAs('app', () => ({
  environment: process.env.NODE_ENV || 'production',
  apiVersion: process.env.API_VERSION || '1.0',
  port: parseInt(process.env.PORT || '3000', 10),
  awsBucketName: process.env.AWS_BUCKET_NAME,
  awsRegion: process.env.AWS_REGION,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
}));
