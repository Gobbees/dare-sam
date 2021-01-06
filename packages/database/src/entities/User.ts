import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  Index,
} from 'typeorm';
import FacebookPage from './FacebookPage';

@Index('users_pkey', ['id'], { unique: true })
@Entity('users')
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('character varying', { name: 'name', nullable: true, length: 255 })
  name!: string | null;

  @Column('character varying', { name: 'email', nullable: true, length: 255 })
  email!: string | null;

  @Column('timestamp with time zone', {
    name: 'email_verified',
    nullable: true,
  })
  emailVerified!: Date | null;

  @Column('character varying', { name: 'image', nullable: true, length: 255 })
  image!: string | null;

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

  @Column({
    type: 'varchar',
    name: 'fb_access_token',
    nullable: true,
  })
  facebookAccessToken!: string;

  @OneToMany(() => FacebookPage, (facebookPage) => facebookPage.pageOwner)
  facebookPages!: FacebookPage[] | undefined;
}
