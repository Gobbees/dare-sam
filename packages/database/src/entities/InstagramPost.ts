import {
  Entity,
  Column,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  MoreThanOrEqual,
  Not,
  IsNull,
  FindConditions,
} from 'typeorm';
import BaseEntityWithMetadata from '../baseEntity';
import { Sentiment } from '../commonValues';
import { FindOptions } from './common/common';
import InstagramComment from './InstagramComment';
import InstagramProfile from './InstagramProfile';

@Entity('instagram_posts')
@Index('ig_post_pkey', ['id'], { unique: true })
export default class InstagramPost extends BaseEntityWithMetadata {
  // TODO this is temporary and will probably be merged with FacebookPost
  @PrimaryColumn({
    name: 'id',
  })
  id!: string;

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

  @Column({
    name: 'comments_count',
    default: 0,
  })
  commentsCount!: number;

  @Column({
    name: 'published_date',
    default: new Date('1970-01-01T00:00:00.000Z'),
  })
  publishedDate!: Date;

  @Column({
    type: 'enum',
    enum: Sentiment,
    name: 'post_sentiment',
    nullable: true,
  })
  postSentiment!: Sentiment;

  @Column({
    name: 'comments_overall_sentiment',
    type: 'double precision',
    nullable: true,
  })
  commentsOverallSentiment!: number;

  @ManyToOne(
    () => InstagramProfile,
    (instagramProfile) => instagramProfile.posts,
  )
  profile!: InstagramProfile;

  @OneToMany(
    () => InstagramComment,
    (instagramComment) => instagramComment.post,
  )
  comments!: InstagramComment[];

  // Queries

  static findPostsByProfileAndPublishedDate = async (
    profile: InstagramProfile,
    publishedDate: Date,
    options?: FindOptions,
  ) => {
    const optionsProps: Partial<FindConditions<InstagramPost>> = {};
    if (options?.unanalyzedOnly) {
      optionsProps.postSentiment = IsNull();
    }
    if (options?.nonEmpty) {
      optionsProps.message = Not(IsNull());
    }
    return InstagramPost.find({
      where: {
        profile,
        publishedDate: MoreThanOrEqual(publishedDate),
        ...optionsProps,
      },
    });
  };
}
