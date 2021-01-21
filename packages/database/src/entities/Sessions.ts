// NEXT_AUTH REQUIRED

import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import BaseEntityWithMetadata from '../baseEntityWithMetadata';

@Index('access_token', ['accessToken'], { unique: true })
@Index('sessions_pkey', ['id'], { unique: true })
@Index('session_token', ['sessionToken'], { unique: true })
@Entity('sessions', { schema: 'public' })
export default class Sessions extends BaseEntityWithMetadata {
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
}
