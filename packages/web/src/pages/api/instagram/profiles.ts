import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth/client';
import { Source } from '@crystal-ball/common';
import {
  SocialProfile,
  Session as NextSession,
  User,
} from '@crystal-ball/database';
import { SocialProfile as ClientIGProfile } from '../../../types';
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
    const instagrampProfile = await SocialProfile.findOne({
      where: { externalId: profile.id },
    });
    if (instagrampProfile) {
      console.error(
        `Trying to add an already present Instagram Profile: ${instagrampProfile.id}`,
      );
      return res.status(400).json({
        error:
          "The Instagram Profile you're trying to add is already present in our systems. Please try with another one.",
      });
    }
    const createdProfile = await SocialProfile.insert({
      externalId: profile.id,
      source: Source.Instagram,
      name: profile.name,
      picture: profile.picture,
      owner: { id: userId },
    });
    const createdProfileId = createdProfile.identifiers[0].id;
    await User.update(userId, { instagramProfileId: createdProfileId });
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
    return createProfile(req, res, session);
  }
  return res.status(404).end();
};

export default async (req: NextApiRequest, res: NextApiResponse) =>
  authenticatedRoute(req, res, profiles);
