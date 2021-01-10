import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401);
  }
  const fbAccessToken = req.query.shortLivedToken;
  console.log(fbAccessToken);
  if (!fbAccessToken) {
    return res.status(400).end();
  }
  // TODO axios everywhere
  const response = await fetch(
    `https://graph.facebook.com/v9.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&fb_exchange_token=${fbAccessToken}`,
  ); // TODO export this in @crystal-ball/common

  const data = await response.json();
  return res.status(200).json(data);
};
