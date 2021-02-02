/* eslint-disable no-restricted-syntax */
import { TypeOrmManager } from '@crystal-ball/database';
import serviceConfig from '../serviceConfig';
import { fetchAllUsers } from './service/fetchers/users';
import fetchFacebookData from './service/workers/facebook/FacebookWorker';
import sleepFor from './utils';

require('dotenv-flow').config();

const MIN_TIME_INTERVAL = 3600;
// config
if (serviceConfig.timeInterval < MIN_TIME_INTERVAL) {
  console.error(
    'The imputted time interval is invalid. Please see serviceConfig.ts for additional information',
  );
  process.exit(1);
}

const service = async () => {
  while (true) {
    console.log(`Service started at ${new Date()}`);
    // create database connection
    if (!TypeOrmManager.isConnected()) {
      await TypeOrmManager.connect({
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
        username: process.env.POSTGRES_USERNAME || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'password',
        database: process.env.POSTGRES_DATABASE || 'database',
        developmentMode: process.env.NODE_ENV === 'development',
      });
    }
    const users = await fetchAllUsers();
    for (const user of users) {
      await fetchFacebookData(user, {
        fetchSinceDays: serviceConfig.fetchSinceDays,
      });
    }

    await TypeOrmManager.maybeCloseConnection();
    console.log(`Service finished at ${new Date()}`);
    await sleepFor(serviceConfig.timeInterval);
  }
};

service();
