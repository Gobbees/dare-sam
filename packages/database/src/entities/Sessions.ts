// NEXT_AUTH REQUIRED

import {
  BaseEntity,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('access_token', ['accessToken'], { unique: true })
@Index('sessions_pkey', ['id'], { unique: true })
@Index('session_token', ['sessionToken'], { unique: true })
@Entity('sessions', { schema: 'public' })
export default class Sessions extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { name: 'user_id' })
  userId!: string;

  @Column('timestamp with time zone', { name: 'expires' })
  expires!: Date;

  @Column('character varying', { name: 'session_token', length: 255 })
  sessionToken!: string;

  @Column('character varying', { name: 'access_token', length: 255 })
  accessToken!: string;

  @Column('timestamp with time zone', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @Column('timestamp with time zone', {
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;
}
