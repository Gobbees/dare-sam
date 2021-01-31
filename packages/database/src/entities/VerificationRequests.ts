// NEXT_AUTH_REQUIRED

import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import BaseEntityWithMetadata from '../BaseEntityWithMetadata';

@Index('verification_requests_pkey', ['id'], { unique: true })
@Index('token', ['token'], { unique: true })
@Entity('verification_requests')
export default class VerificationRequests extends BaseEntityWithMetadata {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('character varying', { name: 'identifier', length: 255 })
  identifier!: string;

  @Column('character varying', { name: 'token', length: 255 })
  token!: string;

  @Column('timestamp with time zone', { name: 'expires' })
  expires!: Date;
}
