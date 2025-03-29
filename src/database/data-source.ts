import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const isDevelopment = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: isDevelopment,
  logging: true,
  entities: [process.env.DB_ENTITIES!],
  migrations: [process.env.DB_MIGRATIONS!],
  migrationsTableName: 'migrations',
});
