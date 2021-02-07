/* eslint-disable no-restricted-syntax */
import { Source } from '@crystal-ball/common';
import { Comment, Post, SocialProfile, User } from '@crystal-ball/database';
import { fetchInstagramProfilePosts } from '../../fetchers/instagram';

const instagramWorker = async (
  profile: SocialProfile,
  token: string,
  fetchSinceDate: Date,
) => {
  console.log(`Fetching Instagram profile: ${profile.name}`);

  const posts = await fetchInstagramProfilePosts({
    profileId: profile.externalId,
    token: token,
    fromDate: fetchSinceDate,
    withComments: true,
    withCommentsReplies: true,
  });
  // TODO wrap every function call in a manageCall
  // that handles all the GraphErrors and reacts accordingly
  if (!posts) {
    return;
  }

  // updates posts
  for (const post of posts) {
    let postInDB = await Post.findOneBySource(Source.Instagram, post.id);
    let postUpdateProperties: Partial<Post> = {};
    if (postInDB) {
      const shouldRecomputeSentiment = postInDB.message !== post.message;
      postUpdateProperties = {
        likeCount: post.likeCount,
        commentCount: post.commentCount,
        publishedDate: post.publishedDate,
        message: post.message,
        sentiment: shouldRecomputeSentiment ? undefined : postInDB.sentiment,
        picture: post.picture,
      };
    } else {
      postUpdateProperties = {
        externalId: post.id,
        source: Source.Instagram,
        publishedDate: post.publishedDate,
        message: post.message,
        picture: post.picture,
        commentCount: post.commentCount,
        likeCount: post.likeCount,
        parentProfile: profile,
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
          Source.Instagram,
          comment.id,
        );
        let commentUpdateProperties: Partial<Comment> = {};
        if (commentInDB) {
          // Instagram doesn't allow to edit comments so no need to check that
          commentUpdateProperties = {
            likeCount: comment.likeCount,
            repliesCount: comment.repliesCount,
          };
        } else {
          commentUpdateProperties = {
            externalId: comment.id,
            source: Source.Instagram,
            message: comment.message,
            publishedDate: comment.publishedDate,
            repliesCount: comment.repliesCount,
            likeCount: comment.likeCount,
            parentPost: postInDB,
          };
        }
        commentInDB = await Comment.save({
          ...commentInDB,
          ...commentUpdateProperties,
        } as Comment);

        if (comment.replies) {
          // updates comment replies
          for (const reply of comment.replies) {
            const replyInDB = await Comment.findOneBySource(
              Source.Instagram,
              reply.id,
            );
            let replyUpdateProperties: Partial<Comment> = {};
            if (replyInDB) {
              // Instagram doesn't allow to edit comments so no need to check that
              replyUpdateProperties = {
                likeCount: reply.likeCount,
              };
            } else {
              replyUpdateProperties = {
                externalId: reply.id,
                source: Source.Instagram,
                message: reply.message,
                publishedDate: reply.publishedDate,
                likeCount: reply.likeCount,
                replyTo: commentInDB,
                parentPost: postInDB,
              };
            }
            await Comment.save({
              ...replyInDB,
              ...replyUpdateProperties,
            } as Comment);
          }
        }
      }
    }
  }
};

export default instagramWorker;
