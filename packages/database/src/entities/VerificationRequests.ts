// NEXT_AUTH_REQUIRED

import {
  BaseEntity,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('verification_requests_pkey', ['id'], { unique: true })
@Index('token', ['token'], { unique: true })
@Entity('verification_requests', { schema: 'public' })
export default class VerificationRequests extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('character varying', { name: 'identifier', length: 255 })
  identifier!: string;

  @Column('character varying', { name: 'token', length: 255 })
  token!: string;

  @Column('timestamp with time zone', { name: 'expires' })
  expires!: Date;

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
