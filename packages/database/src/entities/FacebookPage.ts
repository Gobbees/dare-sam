import {
  Entity,
  Column,
  OneToMany,
  PrimaryColumn,
  Index,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import BaseEntityWithMetadata from '../baseEntity';
import FacebookPost from './FacebookPost';
import User from './User';

@Entity('facebook_pages')
@Index('fb_page_pkey', ['id'], { unique: true })
export default class FacebookPage extends BaseEntityWithMetadata {
  @PrimaryColumn({
    name: 'id',
  })
  id!: string;

  @OneToOne(() => User, (user) => user.facebookPage, { onDelete: 'CASCADE' })
  @JoinColumn()
  owner!: User;

  @Column({
    name: 'name',
  })
  name!: string;

  @Column({
    name: 'picture',
  })
  picture!: string;

  @OneToMany(() => FacebookPost, (facebookPost) => facebookPost.page)
  posts!: FacebookPost[];
}
