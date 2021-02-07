/* eslint-disable no-restricted-syntax */
import { TypeOrmManager } from '@crystal-ball/database';
import serviceConfig from '../serviceConfig';
import { fetchAllUsers } from './service/fetchers/db';
import facebookPageWorker from './service/workers/facebook';
import instagramWorker from './service/workers/instagram';
import { updateSentiments } from './service/workers/sentiment-analysis';
import { sleepFor, fetchSinceDays } from './utils';

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
    const fetchSince = fetchSinceDays(serviceConfig.fetchSinceDays);

    const users = await fetchAllUsers();
    for (const { user, facebookPage, instagramProfile } of users) {
      if (user.facebookAccessToken) {
        console.log(`Fetching Facebook Socials for user ${user.id}...`);
        if (facebookPage) {
          await facebookPageWorker(
            facebookPage,
            user.facebookAccessToken,
            fetchSince,
          );
          if (serviceConfig.computeSentiment) {
            await updateSentiments(facebookPage, fetchSince);
          }
        } else {
          console.log(`No Facebook page linked to ${user.id}, skipping.`);
        }
        if (instagramProfile) {
          await instagramWorker(
            instagramProfile,
            user.facebookAccessToken,
            fetchSince,
          );
          if (serviceConfig.computeSentiment) {
            await updateSentiments(instagramProfile, fetchSince);
          }
        } else {
          console.log(`No Instagram profile linked to ${user.id}, skipping.`);
        }
      } else {
        console.log(
          `[WARN] Skipping Facebook Socials for user ${user.id} since no Facebook Access Token was found.`,
        );
      }
    }

    await TypeOrmManager.maybeCloseConnection();
    console.log(`Service finished at ${new Date()}`);
    await sleepFor(serviceConfig.timeInterval);
  }
};

service();
