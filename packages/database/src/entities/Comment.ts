import { EntitySentiment, Sentiment, Source } from '@crystal-ball/common';
import {
  Entity,
  Column,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  IsNull,
  FindConditions,
  Not,
} from 'typeorm';
import BaseEntityWithMetadata from '../baseEntity';
import { FindOptions } from './common/common';
import Post from './Post';

@Index('comment_id', ['id'], { unique: true })
@Entity('comments')
export default class Comment extends BaseEntityWithMetadata {
  /**
   * Unique ID across all comments and replies (uuid).
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
    nullable: false,
  })
  message!: string;

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
   * SELF EXPLANATORY
   */
  @Column({
    name: 'replies_count',
    nullable: false,
    default: 0,
  })
  repliesCount!: number;

  /**
   * Parent post reference
   */
  @ManyToOne(() => Post, (post) => post.comments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  parentPost!: Post;

  /**
   * SELF EXPLANATORY
   */
  @OneToMany(() => Comment, (comment) => comment.replyTo, {
    nullable: true,
  })
  replies!: Comment[];

  /**
   * Reference of the parent comment (used only if the instance is a reply)
   */
  @ManyToOne(() => Comment, (comment) => comment.replies, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  replyTo?: Comment;

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
   * Detected entities sentiment.
   * It is of the form:
   * {
   * "entity": Sentiment
   * }
   */
  @Column({
    name: 'entities_sentiment',
    type: 'json',
    nullable: true,
  })
  entitiesSentiment?: EntitySentiment[];

  // Queries

  static findOneBySource = (source: Source, externalId: string) =>
    Comment.findOne({ where: { source, externalId } });

  static findByPost = (post: Post, options?: FindOptions) =>
    Comment.find({
      where: {
        parentPost: post,
        ...getOptionsObject(options),
      },
    });

  static findCommentsByPost = (postId: string, options?: FindOptions) =>
    Comment.find({
      where: {
        parentPost: { id: postId },
        replyTo: IsNull(),
        ...getOptionsObject(options),
      },
    });

  static findCommentsByPostWithExternalId = (
    postExteralId: string,
    options?: FindOptions,
  ) =>
    Comment.find({
      where: {
        parentPost: { externalId: postExteralId },
        replyTo: IsNull(),
        ...getOptionsObject(options),
      },
    });

  static findRepliesByPost = (postId: string, options?: FindOptions) =>
    Comment.find({
      where: {
        parentPost: { id: postId },
        replyTo: Not(IsNull()),
        ...getOptionsObject(options),
      },
    });

  static findRepliesByComment = (comment: Comment, options?: FindOptions) =>
    Comment.find({
      where: {
        replyTo: comment,
        ...getOptionsObject(options),
      },
    });
}

const getOptionsObject = (options?: FindOptions) => {
  const returnOptions: Partial<FindConditions<Comment>> = {};
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
