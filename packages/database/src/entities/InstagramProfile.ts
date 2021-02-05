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
import InstagramPost from './InstagramPost';
import User from './User';

@Entity('instagram_profiles')
@Index('ig_profile_pkey', ['id'], { unique: true })
export default class InstagramProfile extends BaseEntityWithMetadata {
  // TODO this is temporary and will probably be merged with FacebookPages
  @PrimaryColumn({
    name: 'id',
  })
  id!: string;

  @OneToOne(() => User, (user) => user.instagramProfile, {
    onDelete: 'CASCADE',
  })
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

  @OneToMany(() => InstagramPost, (instagramPost) => instagramPost.profile)
  posts!: InstagramPost[];
}
