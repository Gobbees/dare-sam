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
import BaseEntityWithMetadata from '../BaseEntityWithMetadata';
import FacebookPost from './FacebookPost';
import { AnalyzedStatus, EntitySentiment, Sentiment } from '../commonValues';

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

  @ManyToOne(() => FacebookPost, (post) => post.comments)
  post!: FacebookPost;

  @OneToMany(() => FacebookComment, (comment) => comment.replyTo)
  replies!: FacebookComment[];

  @ManyToOne(() => FacebookComment, (comment) => comment.replies)
  replyTo!: FacebookComment;

  // Queries

  static findUnanalyzedByPost = async (post: FacebookPost) => {
    const result = await FacebookComment.find({
      where: {
        post,
        analyzedStatus: AnalyzedStatus.UNANALYZED,
        message: Not(IsNull()),
      },
    });
    return result;
  };
}
