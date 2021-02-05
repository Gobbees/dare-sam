import { User } from '@crystal-ball/database';

export const fetchAllUsers = async () => {
  const users = await User.find({
    relations: ['facebookPage', 'instagramProfile'],
  });
  return users;
};

export const fetchUserByID = async (userId: string) => {
  const user = await User.findOneOrFail(userId);
  return user;
};
