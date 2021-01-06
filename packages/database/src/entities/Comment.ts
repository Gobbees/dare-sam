import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  OneToMany,
} from 'typeorm';

// TODO extract these somewhere
// TODO make a common entity with internalid and externalid

enum Sentiment {
  POSITIVE = 1,
  MIXED = 0,
  NEGATIVE = -1,
}

interface EntitySentiment {
  entity: string;
  sentiment: Sentiment;
}

enum AnalyzedStatus {
  ANALYZED = 1,
  NOT_ANALYZED = 0,
}

@Entity('comments')
export default class Comment extends BaseEntity {
  /**
   * Internal id in the system
   */
  @PrimaryGeneratedColumn('uuid')
  internalId!: string;

  /**
   * External id (that is the ID used by Facebook, Instagram, ...)
   */
  @Column({
    name: 'external_id',
  })
  externalId!: string;

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
    default: AnalyzedStatus.NOT_ANALYZED,
  })
  analyzedStatus!: AnalyzedStatus;

  @OneToMany(() => Comment, (comment) => comment.replyTo)
  replies!: Comment[];

  @ManyToOne(() => Comment, (comment) => comment.replies)
  replyTo!: string;
}
