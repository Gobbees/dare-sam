import {
  Entity,
  Column,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { FacebookPage } from '.';
import BaseEntityWithMetadata from '../BaseEntityWithMetadata';
import { AnalyzedStatus, Sentiment } from '../commonValues';
import FacebookComment from './FacebookComment';

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
}
