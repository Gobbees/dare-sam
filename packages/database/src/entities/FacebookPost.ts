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
} from 'typeorm';
import BaseEntityWithMetadata from '../baseEntity';
import { AnalyzedStatus, Sentiment } from '../commonValues';
import { FindOptions } from './common/common';
import FacebookComment from './FacebookComment';
import FacebookPage from './FacebookPage';

@Entity('facebook_posts')
@Index('post_pkey', ['id'], { unique: true })
export default class FacebookPost extends BaseEntityWithMetadata {
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
    name: 'shares_count',
    default: 0,
  })
  sharesCount!: number;

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
    type: 'enum',
    enum: AnalyzedStatus,
    name: 'analyzed_status',
    default: AnalyzedStatus.UNANALYZED,
  })
  analyzedStatus!: AnalyzedStatus;

  @Column({
    name: 'comments_overall_sentiment',
    nullable: true,
  })
  commentsOverallSentiment!: number;

  @ManyToOne(() => FacebookPage, (facebookPage) => facebookPage.posts)
  page!: FacebookPage;

  @OneToMany(() => FacebookComment, (facebookComment) => facebookComment.post)
  comments!: FacebookComment[];

  static findPostsByPageAndPublishedDate = async (
    page: FacebookPage,
    publishedDate: Date,
    options?: FindOptions,
  ) =>
    FacebookPost.find({
      where: {
        page,
        publishedDate: options?.unanalyzedOnly
          ? MoreThanOrEqual(publishedDate)
          : undefined,
        message: options?.nonEmpty ? Not(IsNull()) : undefined,
      },
    });
}
