import {
  BeforeInsert,
  CreateDateColumn,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { monotonicFactory } from 'ulid';

/**
 * Base entity class that provides common fields and functionality
 * for all entities in the system.
 *
 * @abstract
 * @class BaseEntity
 */
export abstract class BaseEntity {
  /**
   * Unique identifier using ULID
   * @type {string}
   * @generated Uses ULID for time-sortable unique identifiers
   */
  @PrimaryColumn('char', { length: 26 })
  @Index()
  id: string;

  /**
   * Timestamp of when the entity was created
   * @type {Date}
   * @generated
   */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  /**
   * Timestamp of when the entity was last updated
   * @type {Date}
   * @generated
   */
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  /**
   * Deleted at timestamp for soft-deleted entities
   * @type {Date}
   * @nullable
   * @generated
   * @default null
   */
  @CreateDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;

  /**
   * Generates a new ULID for the entity
   * @private
   */
  @BeforeInsert()
  generateId(): void {
    this.id = monotonicFactory()();
  }
}
