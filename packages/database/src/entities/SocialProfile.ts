import { Source } from '@crystal-ball/common';
import {
  Column,
  Entity,
  In,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '.';
import BaseEntityWithMetadata from '../baseEntity';
import Post from './Post';

@Index('social_profile_id', ['id'], { unique: true })
@Unique(['source', 'owner'])
@Entity('social_profiles')
export default class SocialProfile extends BaseEntityWithMetadata {
  /**
   * Unique ID across all profiles (uuid).
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * SELF EXPLANATORY
   */
  @Column({
    name: 'source',
    type: 'enum',
    enum: Source,
    nullable: false,
  })
  source!: Source;

  /**
   * Given ID from the Source (Facebook, Instagram)
   */
  @Column({
    name: 'external_id',
    nullable: false,
  })
  externalId!: string;

  /**
   * SELF EXPLANATORY
   */
  @Column({
    name: 'name',
    nullable: false,
  })
  name!: string;

  /**
   * SELF EXPLANATORY
   */
  @Column({
    name: 'picture',
    nullable: true,
  })
  picture!: string;

  /**
   * Profile owner reference
   */
  @ManyToOne(() => User, { nullable: false })
  owner!: User;

  /**
   * Profile posts
   */
  @OneToMany(() => Post, (post) => post.parentProfile)
  posts!: Post[];

  static findBySourcesAndOwner = (sources: Source[], ownerId: string) =>
    SocialProfile.find({
      where: { source: In(sources), owner: { id: ownerId } },
    });
}
