import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  Index,
  PrimaryColumn,
  IsNull,
  Not,
  FindConditions,
} from 'typeorm';
import BaseEntityWithMetadata from '../baseEntity';
import { EntitySentiment, Sentiment } from '../commonValues';
import { FindOptions } from './common/common';
import InstagramPost from './InstagramPost';

@Entity('instagram_comments')
@Index('ig_comment_id', ['id'], { unique: true })
export default class InstagramComment extends BaseEntityWithMetadata {
  // TODO this is temporary and will probably be merged with FacebookComments
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
    name: 'replies_count',
    default: 0,
  })
  repliesCount!: number;

  @ManyToOne(() => InstagramPost, (post) => post.comments)
  post!: InstagramPost;

  @OneToMany(() => InstagramComment, (comment) => comment.replyTo)
  replies!: InstagramComment[];

  @ManyToOne(() => InstagramComment, (comment) => comment.replies)
  replyTo!: InstagramComment;

  // Queries

  static findCommentsByPost = async (postId: string, options?: FindOptions) => {
    const optionsProps: Partial<FindConditions<InstagramComment>> = {};
    if (options?.unanalyzedOnly) {
      optionsProps.overallSentiment = IsNull();
    }
    if (options?.nonEmpty) {
      optionsProps.message = Not(IsNull());
    }
    return InstagramComment.find({
      where: {
        post: postId,
        replyTo: IsNull(),
        ...optionsProps,
      },
    });
  };

  static findRepliesByPost = async (postId: string, options?: FindOptions) => {
    const optionsProps: Partial<FindConditions<InstagramComment>> = {};
    if (options?.unanalyzedOnly) {
      optionsProps.overallSentiment = IsNull();
    }
    if (options?.nonEmpty) {
      optionsProps.message = Not(IsNull());
    }
    return InstagramComment.find({
      where: {
        post: postId,
        replyTo: Not(IsNull()),
        ...optionsProps,
      },
    });
  };
}
