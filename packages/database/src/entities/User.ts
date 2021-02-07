/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import BaseEntityWithMetadata from '../baseEntity';
import SocialProfile from './SocialProfile';

@Index('user_id', ['id'], { unique: true })
@Entity('users')
export default class User extends BaseEntityWithMetadata {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('character varying', { name: 'name', nullable: true, length: 255 })
  name!: string | null;

  @Column('character varying', { name: 'email', nullable: true, length: 255 })
  email!: string | null;

  @Column('timestamp with time zone', {
    name: 'email_verified',
    nullable: true,
  })
  emailVerified!: Date | null;

  @Column('character varying', { name: 'image', nullable: true, length: 255 })
  image!: string | null;

  @Column({
    type: 'varchar',
    name: 'fb_access_token',
    nullable: true,
  })
  facebookAccessToken!: string;

  /**
   * Flag that states if Facebook Token is Long Lived or not.
   */
  @Column({
    name: 'is_fb_access_token_llt',
    nullable: true,
  })
  isFacebookAccessTokenLLT!: boolean;

  @Column({
    name: 'facebook_page_id',
    type: 'uuid',
    nullable: true,
  })
  facebookPageId?: string;

  @Column({
    name: 'instagram_profile_id',
    type: 'uuid',
    nullable: true,
  })
  instagramProfileId?: string;

  // Queries
  static findAllUsersWithProfiles = async () => {
    const users = await User.find();
    const returnObject = [];
    for (const user of users) {
      const facebookPage = user.facebookPageId
        ? await SocialProfile.findOne(user.facebookPageId)
        : undefined;
      const instagramProfile = user.instagramProfileId
        ? await SocialProfile.findOne(user.instagramProfileId)
        : undefined;
      returnObject.push({
        user,
        facebookPage,
        instagramProfile,
      });
    }
    return returnObject;
  };

  static findOneUserWithProfiles = async (userId: string) => {
    const user = await User.findOne(userId);
    if (!user) {
      return undefined;
    }
    const facebookPage = user.facebookPageId
      ? await SocialProfile.findOne(user.facebookPageId)
      : undefined;
    const instagramProfile = user.instagramProfileId
      ? await SocialProfile.findOne(user.instagramProfileId)
      : undefined;
    return {
      user,
      facebookPage,
      instagramProfile,
    };
  };
}
