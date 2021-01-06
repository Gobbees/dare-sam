import { TypeOrmManager } from '@crystal-ball/database';
import serviceConfig from '../serviceConfig';
// import {
//   fetchFacebookPagePosts,
//   fetchFacebookPages,
// } from './service/fetchers/facebook';
import { fetchAllUsers } from './service/fetchers/fetchUsers';
// import sleepFor from './utils';

require('dotenv').config();

const MIN_TIME_INTERVAL = 3600;
// config
if (serviceConfig.timeInterval < MIN_TIME_INTERVAL) {
  console.error(
    'The imputted time interval is invalid. Please see serviceConfig.ts for additional information',
  );
  process.exit(1);
}

const config = async () => {
  // create database connection
  await TypeOrmManager.connect({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    username: process.env.POSTGRES_USERNAME || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'password',
    database: process.env.POSTGRES_DATABASE || 'database',
    developmentMode: process.env.NODE_ENV === 'development',
  });

  const users = await fetchAllUsers();
  // users.forEach(() => {
  //   // fetches all the comments and updates the db
  //   // fetchFacebookData();
  //   // fetchInstagramData();
  //   // fetchTwitterData();
  // });

  // const response = await fetchFacebookPages(process.env.TOKEN!);
  // if (response) {
  //   const posts = await fetchFacebookPagePosts(
  //     response[0].pid,
  //     process.env.TOKEN!,
  //   );
  console.log(users);
  // }
  // await sleepFor(serviceConfig.timeInterval);
};

config();
