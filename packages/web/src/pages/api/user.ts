import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth/client';
import { Source } from '@crystal-ball/common';
import { Session as NextSession, User } from '@crystal-ball/database';
import { SocialProfile, User as ClientUser } from '../../types';
import authenticatedRoute from '../../app/utils/apiRoutes';

const getUser = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
) => {
  const { userId } = await NextSession.findOneOrFail({
    where: { accessToken: session.accessToken },
    select: ['userId'],
  });
  const user = await User.findOneUserWithProfiles(userId);
  if (!user) {
    return res.status(404).end();
  }
  const facebookPage: SocialProfile | undefined = user.facebookPage && {
    id: user.facebookPage.id,
    source: Source.Facebook,
    name: user.facebookPage.name,
    picture: user.facebookPage.picture,
  };
  const instagramProfile: SocialProfile | undefined = user.instagramProfile && {
    id: user.instagramProfile.id,
    source: Source.Instagram,
    name: user.instagramProfile.name,
    picture: user.instagramProfile.picture,
  };

  const result: ClientUser = {
    name: user.user.name || undefined,
    email: user.user.email || undefined,
    image: user.user.image || undefined,
    facebookPage,
    instagramProfile,
  };
  return res.status(200).json(JSON.stringify(result));
};

const updateUser = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
) => {
  const { userId } = await NextSession.findOneOrFail({
    where: { accessToken: session.accessToken },
    select: ['userId'],
  });
  const user: Partial<User> = {};

  if (req.body.facebookAccessToken) {
    user.facebookAccessToken = req.body.facebookAccessToken;
  }
  if (req.body.isLongLivedToken !== undefined) {
    user.isFacebookAccessTokenLLT = req.body.isLongLivedToken;
  } else {
    return res.status(400).end();
  }
  try {
    await User.update(userId, { ...user });
    return res.status(200).end();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const user = (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  if (req.method === 'GET') {
    return getUser(req, res, session);
  }
  if (req.method === 'POST') {
    return updateUser(req, res, session);
  }
  return res.status(404).end();
};

export default async (req: NextApiRequest, res: NextApiResponse) =>
  authenticatedRoute(req, res, user);
