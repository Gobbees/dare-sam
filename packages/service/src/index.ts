import { FacebookPage, Post, TypeOrmManager } from '@crystal-ball/database';
import FacebookComment from '../../database/src/entities/FacebookComment';
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
        developmentMode: false,
      });
    }

    const users = await fetchAllUsers();
    console.log(users);
    // fetches all the comments and updates the db
    // fetchFacebookData();
    await Promise.allSettled(
      users.map(async (user) => {
        const pages = await FacebookPage.find({
          where: { pageOwner: user.id },
        });
        await Promise.allSettled(
          pages?.map(async (page) => {
            console.log(`Fetching page: ${page.name}`);
            const posts = await fetchFacebookPagePosts(
              page.externalId,
              user.facebookAccessToken,
            );
            if (!posts) {
              return;
            }
            await Promise.allSettled(
              posts.map(async (post) => {
                if (
                  !(await Post.findOne({ where: { externalId: post.pid } }))
                ) {
                  // insert new post if not already present
                  const response = await Post.insert({
                    externalId: post.pid,
                    pictureUrl: post.picture,
                    message: post.message,
                    likeCount: post.likeCount,
                    commentsIds:
                      post.comments?.map((comment) => comment.id) || [],
                  });
                  console.log(
                    `Added post ${post.pid} with id ${JSON.stringify(
                      response.identifiers[0],
                    )}`,
                  );
                }
                // updates comments
                await Post.update(
                  { externalId: post.pid },
                  {
                    commentsIds:
                      post.comments?.map((comment) => comment.id) || [],
                  },
                );
                if (post.comments) {
                  console.log(post.comments);
                }
                if (!post.comments) {
                  return;
                }
                await Promise.allSettled(
                  post.comments.map(async (comment) => {
                    if (
                      !(await FacebookComment.findOne({
                        where: { externalId: comment.id },
                      }))
                    ) {
                      const response = await FacebookComment.insert({
                        externalId: comment.id,
                        message: comment.message,
                      });
                      console.log(
                        `Added comment ${comment.id} with id ${JSON.stringify(
                          response.identifiers[0],
                        )}`,
                      );
                    }
                  }),
                );
              }),
            );
          }),
        );
        // fetchInstagramData();
        // fetchTwitterData();
      }),
    );
    await TypeOrmManager.maybeCloseConnection();
    console.log('closed');
    await sleepFor(serviceConfig.timeInterval);
  }
};

service();
