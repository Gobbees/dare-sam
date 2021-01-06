import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (session) {
    // Signed in
    res.json({ Session: JSON.stringify(session, null, 2) });
  } else {
    // Not Signed in
    res.status(401);
  }
};
