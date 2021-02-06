import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth/client';
import {
  InstagramProfile,
  Session as NextSession,
} from '@crystal-ball/database';
import { InstagramProfile as ClientIGProfile } from '../../../types';
import authenticatedRoute from '../../../app/utils/apiRoutes';

const createProfile = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
) => {
  const { userId } = await NextSession.findOneOrFail({
    where: { accessToken: session.accessToken },
    select: ['userId'],
  });
  const profile: ClientIGProfile = { ...req.body.profile };
  try {
    await InstagramProfile.insert({
      id: profile.id,
      name: profile.name,
      picture: profile.picture,
      owner: { id: userId },
    });
    return res.status(200).end();
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: error.message });
  }
};

const profiles = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
) => {
  if (req.method === 'POST') {
    console.log('POST');
    return createProfile(req, res, session);
  }
  return res.status(404).end();
};

export default async (req: NextApiRequest, res: NextApiResponse) =>
  authenticatedRoute(req, res, profiles);
