import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth/client';
import { Session as NextSession, User } from '@crystal-ball/database';
import authenticatedRoute from '../../../app/utils/apiRoutes';

const tokens = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
) => {
  const { userId } = await NextSession.findOneOrFail({
    where: { accessToken: session.accessToken },
    select: ['userId'],
  });
  const { token, isLongLived } = req.body;
  if (!token || isLongLived === undefined) {
    return res.status(400).end();
  }

  console.log('Fetching long-lived token from short lived one...');

  const response = await fetch(
    `https://graph.facebook.com/v9.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&fb_exchange_token=${token}`,
  );

  const data = await response.json();

  if (data.access_token) {
    console.log('Successfully fetched user long lived token');
    await User.update(userId, {
      facebookAccessToken: data.access_token,
      isFacebookAccessTokenLLT: true,
    });
  } else {
    console.log('Error while fetching user long lived token');
    await User.update(userId, {
      facebookAccessToken: token,
      isFacebookAccessTokenLLT: false,
    });
  }
  return res.status(200).end();
};

export default async (req: NextApiRequest, res: NextApiResponse) =>
  authenticatedRoute(req, res, tokens);
