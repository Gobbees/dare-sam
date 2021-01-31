import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  Index,
} from 'typeorm';
import BaseEntityWithMetadata from '../BaseEntityWithMetadata';
import FacebookPost from './FacebookPost';
import User from './User';

@Entity('facebook_pages')
@Index('page_pkey', ['id'], { unique: true })
export default class FacebookPage extends BaseEntityWithMetadata {
  @PrimaryColumn({
    name: 'id',
  })
  id!: string;

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

  @OneToMany(() => FacebookPost, (facebookPost) => facebookPost.page)
  posts!: FacebookPost[];
}
