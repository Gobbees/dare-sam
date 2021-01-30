import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { FacebookPage } from '.';
import BaseEntityWithMetadata from '../baseEntityWithMetadata';
import FacebookComment from './FacebookComment';

@Entity('facebook_posts')
@Index('post_id', ['externalId'], { unique: true })
export default class FacebookPost extends BaseEntityWithMetadata {
  /**
   * Internal id in the system
   */
  @PrimaryGeneratedColumn('uuid')
  internalId!: string;

  /**
   * External id (that is the ID used by Facebook)
   */
  @Column({
    name: 'external_id',
  })
  externalId!: string;

  @Column({
    name: 'message',
    nullable: true,
  })
  message!: string;

  @Column({
    name: 'picture_url',
    nullable: true,
  })
  pictureUrl!: string;

  @Column({
    name: 'like_count',
  })
  likeCount!: number;

  @ManyToOne(() => FacebookPage, (facebookPage) => facebookPage.posts)
  page!: FacebookPage;

  @OneToMany(() => FacebookComment, (facebookComment) => facebookComment.post)
  comments!: FacebookComment[];
}
