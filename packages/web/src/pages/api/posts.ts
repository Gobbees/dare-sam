import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth/client';
import { Source } from '@crystal-ball/common';
import {
  SocialProfile,
  Post,
  Session as NextSession,
} from '@crystal-ball/database';
import authenticatedRoute from '../../app/utils/apiRoutes';
import { Post as ClientPost } from '../../types';

/**
 * @returns an array of InstagramPost ordered by published date
 * @param sources the array of sources (Facebook,Instagram). From crystal-ball/common
 */
const posts = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
) => {
  const { userId } = await NextSession.findOneOrFail({
    where: { accessToken: session.accessToken },
    select: ['userId'],
  });
  const {
    isFacebookSelected,
    isInstagramSelected,
    fromDate,
    sinceDate,
  } = req.query;

  if ((!isFacebookSelected && !isInstagramSelected) || !fromDate) {
    return res.status(400).end();
  }

  const sources: Source[] = [];

  if (isFacebookSelected === 'true') {
    sources.push(Source.Facebook);
  }
  if (isInstagramSelected === 'true') {
    sources.push(Source.Instagram);
  }
  const profiles = await SocialProfile.findBySourcesAndOwner(sources, userId);

  const dbPosts = await Post.findByParentProfiles(
    profiles.map((profile) => profile.id),
    {
      fromDate: new Date(fromDate as string),
      sinceDate: sinceDate ? new Date(sinceDate as string) : undefined,
    },
  );

  const returnPosts: ClientPost[] = [];
  dbPosts.forEach((post) =>
    returnPosts.push({
      id: post.id,
      source: post.source,
      message: post.message,
      publishedDate: post.publishedDate,
      permalink: post.permalink,
      sentiment: post.sentiment,
      commentsOverallSentiment: post.commentsOverallSentiment,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
    }),
  );
  return res.status(200).json(JSON.stringify(returnPosts));
};

export default async (req: NextApiRequest, res: NextApiResponse) =>
  authenticatedRoute(req, res, posts);
