import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  Index,
  PrimaryColumn,
  IsNull,
  Not,
} from 'typeorm';
import BaseEntityWithMetadata from '../baseEntity';
import FacebookPost from './FacebookPost';
import { AnalyzedStatus, EntitySentiment, Sentiment } from '../commonValues';
import { FindOptions } from './common/common';

@Entity('facebook_comments')
@Index('comment_id', ['id'], { unique: true })
export default class FacebookComment extends BaseEntityWithMetadata {
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
    name: 'published_date',
    default: new Date('1970-01-01T00:00:00.000Z'),
  })
  publishedDate!: Date;

  @Column({
    name: 'like_count',
    default: 0,
  })
  likeCount!: number;

  @Column({
    name: 'entities_sentiment',
    type: 'json',
    nullable: true,
  })
  entitiesSentiment!: EntitySentiment[];

  @Column({
    type: 'enum',
    enum: Sentiment,
    name: 'overall_sentiment',
    nullable: true,
  })
  overallSentiment!: Sentiment;

  @Column({
    type: 'enum',
    enum: AnalyzedStatus,
    name: 'analyzed_status',
    default: AnalyzedStatus.UNANALYZED,
  })
  analyzedStatus!: AnalyzedStatus;

  @Column({
    name: 'replies_count',
    default: 0,
  })
  repliesCount!: number;

  @ManyToOne(() => FacebookPost, (post) => post.comments)
  post!: FacebookPost;

  @OneToMany(() => FacebookComment, (comment) => comment.replyTo)
  replies!: FacebookComment[];

  @ManyToOne(() => FacebookComment, (comment) => comment.replies)
  replyTo!: FacebookComment;

  // Queries

  static findCommentsByPost = async (
    post: FacebookPost,
    options?: FindOptions,
  ) =>
    FacebookComment.find({
      where: {
        post,
        replyTo: IsNull(),
        analyzedStatus: options?.unanalyzedOnly
          ? AnalyzedStatus.UNANALYZED
          : undefined,
        message: options?.nonEmpty ? Not(IsNull()) : undefined,
      },
    });

  static findRepliesByPost = async (
    post: FacebookPost,
    options?: FindOptions,
  ) =>
    FacebookComment.find({
      where: {
        post,
        replyTo: Not(IsNull()),
        analyzedStatus: options?.unanalyzedOnly
          ? AnalyzedStatus.UNANALYZED
          : undefined,
        message: options?.nonEmpty ? Not(IsNull()) : undefined,
      },
    });
}
