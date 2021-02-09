import { Sentiment, Source } from '@crystal-ball/common';
import {
  Between,
  Column,
  Entity,
  FindConditions,
  In,
  Index,
  IsNull,
  LessThanOrEqual,
  ManyToOne,
  MoreThanOrEqual,
  Not,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import BaseEntityWithMetadata from '../baseEntity';
import Comment from './Comment';
import { FindOptions } from './common/common';
import SocialProfile from './SocialProfile';

@Index('post_id', ['id'], { unique: true })
@Entity('posts')
export default class Post extends BaseEntityWithMetadata {
  /**
   * Unique ID across all posts (uuid).
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
    name: 'message',
    nullable: true,
  })
  message?: string;

  /**
   * Url of the main media content (if present).
   */
  @Column({
    name: 'picture',
    nullable: true,
  })
  picture?: string;

  /**
   * SELF EXPLANATORY
   */
  @Column({
    name: 'published_date',
    nullable: false,
  })
  publishedDate!: Date;

  /**
   * SELF EXPLANATORY
   */
  @Column({
    name: 'like_count',
    nullable: false,
    default: 0,
  })
  likeCount!: number;

  /**
   * This field contains:
   * - share count for Facebook Posts
   * - null for Instagram Posts
   */
  @Column({
    name: 'share_count',
    nullable: true,
  })
  shareCount?: number;

  /**
   * SELF EXPLANATORY
   */
  @Column({
    name: 'comment_count',
    nullable: false,
    default: 0,
  })
  commentCount!: number;

  /**
   * SELF EXPLANATORY
   */
  @OneToMany(() => Comment, (comment) => comment.parentPost)
  comments!: Comment[];

  /**
   * Parent profile reference
   */
  @ManyToOne(() => SocialProfile, (profile) => profile.posts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  parentProfile!: SocialProfile;

  /**
   * Detected sentiment
   */
  @Column({
    type: 'enum',
    enum: Sentiment,
    name: 'sentiment',
    nullable: true,
  })
  sentiment?: Sentiment;

  /**
   * Overall (average) sentiment detected in comments.
   * Double number from -1 to 1
   */
  @Column({
    name: 'comments_overall_sentiment',
    type: 'double precision',
    nullable: true,
  })
  commentsOverallSentiment?: number;

  // Queries

  static findOneBySource = (source: Source, externalId: string) =>
    Post.findOne({ where: { source, externalId } });

  static findBySourceAndPublishedDate = (
    source: Source,
    externalId: string,
    publishedDate: Date,
  ) =>
    Post.find({
      where: {
        source,
        externalId,
        publishedDate: MoreThanOrEqual(publishedDate),
      },
    });

  static findByIdAndPublishedDate = (id: string, publishedDate: Date) =>
    Post.find({
      where: {
        id,
        publishedDate: MoreThanOrEqual(publishedDate),
      },
    });

  static findPostsBySocialProfileAndPublishedDate = (
    profile: SocialProfile,
    publishedDate: Date,
    options?: FindOptions,
  ) =>
    Post.find({
      where: {
        parentProfile: profile,
        publishedDate: MoreThanOrEqual(publishedDate),
        ...getOptionsObject(options),
      },
    });

  static findByParentProfiles = (
    profileIds: string[],
    dateInterval: { fromDate?: Date; sinceDate?: Date },
  ) => {
    let dateFilter;
    if (dateInterval.fromDate && dateInterval.sinceDate) {
      dateFilter = Between(dateInterval.fromDate, dateInterval.sinceDate);
    } else if (dateInterval.fromDate) {
      dateFilter = MoreThanOrEqual(dateInterval.fromDate);
    } else if (dateInterval.sinceDate) {
      dateFilter = LessThanOrEqual(dateInterval.sinceDate);
    }
    return Post.find({
      where: {
        parentProfile: In(profileIds),
        publishedDate: dateFilter,
      },
      order: { publishedDate: 'DESC' },
    });
  };
}

const getOptionsObject = (options?: FindOptions) => {
  const returnOptions: Partial<FindConditions<Post>> = {};
  if (options?.unanalyzedOnly) {
    returnOptions.sentiment = IsNull();
  }
  if (options?.nonEmpty) {
    returnOptions.message = Not(IsNull());
  }
  if (options?.analyzedOnly) {
    returnOptions.sentiment = Not(IsNull());
  }
  return returnOptions;
};
