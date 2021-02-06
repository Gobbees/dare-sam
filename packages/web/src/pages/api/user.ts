import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth/client';
import { Session as NextSession, User } from '@crystal-ball/database';
import {
  FacebookPage,
  InstagramProfile,
  User as ClientUser,
} from '../../types';
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
  const user = await User.findOneOrFail({
    where: { id: userId },
    relations: ['facebookPage', 'instagramProfile'],
  });
  const facebookPage: FacebookPage | undefined = user.facebookPage && {
    id: user.facebookPage.id,
    name: user.facebookPage.name,
    picture: user.facebookPage.picture,
  };
  const instagramProfile:
    | InstagramProfile
    | undefined = user.instagramProfile && {
    id: user.instagramProfile.id,
    name: user.instagramProfile.name,
    picture: user.instagramProfile.picture,
  };

  const result: ClientUser = {
    name: user.name || undefined,
    email: user.email || undefined,
    image: user.image || undefined,
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
