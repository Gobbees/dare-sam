import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from 'typeorm';
import User from './User';

@Entity('facebook_pages')
export default class FacebookPage extends BaseEntity {
  /**
   * Internal id in the system
   */
  @PrimaryGeneratedColumn('uuid')
  internalId!: string;

  /**
   * External id (that is the ID used by Facebook, Instagram, ...)
   */
  @Column({
    name: 'external_id',
  })
  externalId!: string;

  @ManyToOne(() => User, (user) => user.facebookPages)
  @Column({
    name: 'page_owner',
  })
  pageOwner!: string;

  @Column({
    name: 'name',
  })
  name!: string;

  @Column({
    name: 'picture',
  })
  picture!: string;

  // TODO add posts
}
