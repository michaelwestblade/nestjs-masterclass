import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'staging')
    .required()
    .default('development'),
  DB_PORT: Joi.number().default(5432),
  DB_HOST: Joi.string().default('localhost'),
  DB_USER: Joi.string().default('admin'),
  DB_PASS: Joi.string(),
  DB_NAME: Joi.string().default('nestjs-blog'),
  DB_SYNC: Joi.boolean().default(true),
  DB_AUTO_LOAD: Joi.boolean().default(true),
  PROFILE_API_KEY: Joi.string().required().default(''),
  JWT_SECRET: Joi.string().required(),
  JWT_TOKEN_AUDIENCE: Joi.string().required(),
  JWT_TOKEN_ISSUER: Joi.string().required(),
  JWT_ACCESS_TOKEN_TTL: Joi.number().required(),
  JWT_REFRESH_TOKEN_TTL: Joi.number().required(),
  API_VERSION: Joi.string().required(),
});
