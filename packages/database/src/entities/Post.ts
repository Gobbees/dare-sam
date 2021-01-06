import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
// import { Sources } from '../service';

@Entity('posts')
export default class Post extends BaseEntity {
  /**
   * Internal id in the system
   */
  @PrimaryGeneratedColumn('uuid')
  internalId!: string;

  // @Column({
  //   type: 'enum',
  //   enum: Sources,
  // })
  // source!: Sources;

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
    name: 'picture_url',
    nullable: true,
  })
  pictureUrl!: string;

  @Column({
    name: 'like_count',
  })
  likeCount!: number;

  /**
   * Array of comments' external ids
   */
  @Column('simple-array', {
    name: 'comments_ids',
  })
  commentsIds!: string[];
}
