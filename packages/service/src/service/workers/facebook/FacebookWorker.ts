/* eslint-disable no-restricted-syntax */
import { Source } from '@crystal-ball/common';
import { Comment, Post, SocialProfile } from '@crystal-ball/database';
import { fetchFacebookPagePosts } from '../../fetchers/facebook';

const facebookPageWorker = async (
  page: SocialProfile,
  token: string,
  fetchSinceDate: Date,
) => {
  console.log(`Fetching Facebook page: ${page.name}`);

  const posts = await fetchFacebookPagePosts({
    pageId: page.externalId,
    token,
    fromDate: fetchSinceDate,
    withComments: true,
    withCommentsReplies: true,
  });

  if (!posts) {
    return;
  }

  // updates posts
  for (const post of posts) {
    let postInDB = await Post.findOneBySource(Source.Facebook, post.id);
    let postUpdateProperties: Partial<Post> = {};
    if (postInDB) {
      const shouldRecomputeSentiment = postInDB.message !== post.message;
      postUpdateProperties = {
        likeCount: post.likeCount,
        commentCount: post.commentCount,
        shareCount: post.sharesCount,
        publishedDate: post.publishedDate,
        message: post.message,
        sentiment: shouldRecomputeSentiment ? undefined : postInDB.sentiment,
        picture: post.picture,
      };
    } else {
      postUpdateProperties = {
        externalId: post.id,
        source: Source.Facebook,
        publishedDate: post.publishedDate,
        permalink: post.permalink,
        message: post.message,
        picture: post.picture,
        commentCount: post.commentCount,
        shareCount: post.sharesCount,
        likeCount: post.likeCount,
        parentProfile: page,
      };
    }
    postInDB = await Post.save({
      ...postInDB,
      ...postUpdateProperties,
    } as Post);

    if (post.comments) {
      // updates post comments
      for (const comment of post.comments) {
        let commentInDB = await Comment.findOneBySource(
          Source.Facebook,
          comment.id,
        );
        let commentUpdateProperties: Partial<Comment> = {};
        if (commentInDB) {
          const shouldRecomputeSentiment =
            commentInDB.message !== comment.message;
          commentUpdateProperties = {
            likeCount: comment.likeCount,
            message: comment.message,
            repliesCount: comment.repliesCount,
            sentiment: shouldRecomputeSentiment
              ? undefined
              : commentInDB.sentiment,
            entitiesSentiment: shouldRecomputeSentiment
              ? undefined
              : commentInDB.entitiesSentiment,
          };
        } else if (comment.message) {
          commentUpdateProperties = {
            externalId: comment.id,
            source: Source.Facebook,
            message: comment.message,
            publishedDate: comment.publishedDate,
            repliesCount: comment.repliesCount,
            likeCount: comment.likeCount,
            parentPost: postInDB,
          };
        } else {
          // this skips comments without message since we don't need them
          // eslint-disable-next-line no-continue
          continue;
        }
        commentInDB = await Comment.save({
          ...commentInDB,
          ...commentUpdateProperties,
        } as Comment);

        if (comment.replies) {
          // updates comment replies
          for (const reply of comment.replies) {
            let replyInDB = await Comment.findOneBySource(
              Source.Facebook,
              reply.id,
            );
            let replyUpdateProperties: Partial<Comment> = {};
            if (replyInDB) {
              const shouldRecomputeSentiment =
                replyInDB.message !== reply.message;
              replyUpdateProperties = {
                likeCount: reply.likeCount,
                message: reply.message,
                sentiment: shouldRecomputeSentiment
                  ? undefined
                  : replyInDB.sentiment,
                entitiesSentiment: shouldRecomputeSentiment
                  ? undefined
                  : replyInDB.entitiesSentiment,
              };
            } else if (reply.message) {
              replyUpdateProperties = {
                externalId: reply.id,
                source: Source.Facebook,
                message: reply.message,
                publishedDate: reply.publishedDate,
                likeCount: reply.likeCount,
                replyTo: commentInDB,
                parentPost: postInDB,
              };
            } else {
              // this skips empty replies
              // eslint-disable-next-line no-continue
              continue;
            }
            replyInDB = await Comment.save({
              ...replyInDB,
              ...replyUpdateProperties,
            } as Comment);
          }
        }
      }
    }
  }
};

export default facebookPageWorker;
