/* eslint-disable no-restricted-syntax */
import {
  FacebookComment,
  FacebookPage,
  FacebookPost,
  TypeOrmManager,
} from '@crystal-ball/database';
import serviceConfig from '../serviceConfig';
import { fetchFacebookPagePosts } from './service/fetchers/facebook';
import { fetchAllUsers } from './service/fetchers/fetchUsers';
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
    console.log(`Service ran at ${new Date()}`);
    // create database connection
    if (!TypeOrmManager.isConnected()) {
      await TypeOrmManager.connect({
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
        username: process.env.POSTGRES_USERNAME || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'password',
        database: process.env.POSTGRES_DATABASE || 'database',
        developmentMode: true,
      });
    }
    // fetches posts old 15 days maximum
    const fetchSince = new Date(
      new Date().getTime() - 1000 * 60 * 60 * 24 * 15000,
    );

    const users = await fetchAllUsers();
    for (const user of users) {
      const pages = await FacebookPage.find({
        where: { pageOwner: user.id },
      });
      for (const page of pages) {
        console.log(`Fetching page: ${page.name}`);
        // const posts: FacebookPost[] = [];
        const posts = await fetchFacebookPagePosts({
          pageId: page.externalId,
          token: user.facebookAccessToken,
          fromDate: fetchSince,
          withComments: true,
          withCommentsReplies: true,
        });
        // TODO wrap every function call in a manageCall
        // that handles all the GraphErrors and reacts accordingly
        if (!posts) {
          return;
        }
        for (const post of posts) {
          if (
            !(await FacebookPost.findOne({ where: { externalId: post.pid } }))
          ) {
            // insert new post if not already present
            const response = await FacebookPost.insert({
              externalId: post.pid,
              pictureUrl: post.picture,
              message: post.message,
              likeCount: post.likeCount,
            });
            console.log(
              `Added post ${post.pid} with id ${JSON.stringify(
                response.identifiers[0],
              )}`,
            );
          }
          // if (post.comments?.length) {
          //   console.log(post.comments[0].replies);
          // }
          if (!post.comments) {
            return;
          }
          for (const comment of post.comments) {
            if (
              !(await FacebookComment.findOne({
                where: { externalId: comment.id },
              }))
            ) {
              const response = await FacebookComment.insert({
                externalId: comment.id,
                message: comment.message,
                post: await FacebookPost.findOne({
                  where: { externalId: post.pid },
                }),
              });
              console.log(
                `Added comment ${comment.id} with id ${JSON.stringify(
                  response.identifiers[0],
                )}`,
              );
            }
            for (const reply of comment.replies || []) {
              if (
                !(await FacebookComment.findOne({
                  where: { externalId: reply.id },
                }))
              ) {
                const response = await FacebookComment.insert({
                  externalId: reply.id,
                  message: reply.message,
                  replyTo: await FacebookComment.findOne({
                    where: { externalId: reply.replyTo },
                  }),
                  post: await FacebookPost.findOne({
                    where: { externalId: post.pid },
                  }),
                });
                console.log(
                  `Added reply ${comment.id} with id ${JSON.stringify(
                    response.identifiers[0],
                  )}`,
                );
              }
            }
          }
        }
      }
    }

    // await TypeOrmManager.maybeCloseConnection();
    // console.log('closed');
    await sleepFor(serviceConfig.timeInterval);
  }
};

service();
