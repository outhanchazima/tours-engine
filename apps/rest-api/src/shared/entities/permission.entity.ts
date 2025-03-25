import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ulid } from 'ulid';

/**
 * Permission Entity - Represents a system permission
 *
 * This entity defines individual permissions that can be assigned to roles,
 * providing granular access control within the application.
 *
 * @entity Permission
 * @table permissions
 */
@Entity('permissions')
export class Permission {
  /**
   * Unique identifier for the permission
   * @type {string}
   * @generated Uses ULID for time-sortable unique identifiers
   */
  @PrimaryColumn('varchar', {
    length: 26,
    default: () => `'${ulid()}'`,
  })
  id: string;

  /**
   * The unique name of the permission
   * @type {string}
   * @unique
   */
  @Column({ unique: true })
  name: string;

  /**
   * Description of what the permission allows
   * @type {string}
   */
  @Column()
  description: string;
}
