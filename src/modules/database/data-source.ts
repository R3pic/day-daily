import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import process from 'node:process';

import {
  DiarySeeder,
  ThemeSeeder,
  UserSeeder,
} from '@database/seeds';
import {
  DiaryFactory,
  UserFactory,
} from '@database/factories';

process.loadEnvFile('.env.database');

const options: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT!, 10),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  dropSchema: true,
  synchronize: true,
  entities: ['src/modules/**/entities/*.entity.ts'],

  seeds: [
    ThemeSeeder,
    UserSeeder,
    DiarySeeder,
  ],

  factories: [
    UserFactory,
    DiaryFactory,
  ],
};

export const dataSource = new DataSource(options);

console.info('initialized DataSource');