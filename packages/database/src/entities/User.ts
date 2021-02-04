import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToOne,
} from 'typeorm';
import BaseEntityWithMetadata from '../baseEntity';
import FacebookPage from './FacebookPage';

@Index('users_pkey', ['id'], { unique: true })
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

  @Column({
    name: 'is_fb_access_token_llt',
    nullable: true,
  })
  isFacebookAccessTokenLLT!: boolean;

  @OneToOne(() => FacebookPage, (facebookPage) => facebookPage.owner)
  facebookPage!: FacebookPage | undefined;

  // instagramProfile!: InstagramProfile | undefined;

  // twitterAccount!: TwitterAccount | undefined;
}
