export const appConfig = () => ({
  environment: process.env.NODE_ENV || 'production',
  database: {
    host: process.env.DB_HOST || 'localhost',
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    name: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '5432') || 5432,
    synchronize: process.env.DB_SYNC === 'true',
    autoLoadEntities: process.env.DB_AUTO_LOAD === 'true',
  },
});
