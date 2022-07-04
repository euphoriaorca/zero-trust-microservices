/* istanbul ignore file */
import 'reflect-metadata';
import { ConnectionOptions } from 'typeorm';

import { AdminUsers, Applications, Services } from './models';
import { Initial1581812783596 } from './migrations';

const isDev = process.env.NODE_ENV === 'development';

const connectionOpts: ConnectionOptions = {
  type: 'mysql',
  host: process.env.DB_SERVER,
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [AdminUsers, Applications, Services],
  synchronize: false,
  logging: isDev,
  migrationsRun: true,
  migrations: [Initial1581812783596],
  cli: {
    migrationsDir: './src/migrations',
  },
  charset: 'utf8mb4_unicode_ci',
};

export = connectionOpts;
