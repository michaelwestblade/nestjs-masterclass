import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export default registerAs('app', () => ({
  environment: process.env.NODE_ENV || 'production',
  apiVersion: process.env.API_VERSION || '1.0',
}));
