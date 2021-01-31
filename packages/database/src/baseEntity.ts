import { BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Extension of TypeOrm's BaseEntity with the addition of createdAt and updatedAt
 */
export default class BaseEntityWithMetadata extends BaseEntity {
  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt!: Date;
}
