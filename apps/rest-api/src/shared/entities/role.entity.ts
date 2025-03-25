import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ulid } from 'ulid';
import { Permission } from './permission.entity';

/**
 * Role Entity - Represents a user role in the system
 *
 * This entity defines roles that can be assigned to users, grouping permissions
 * together to manage access control.
 *
 * @entity Role
 * @table roles
 */
@Entity('roles')
export class Role {
  /**
   * Unique identifier for the role
   * @type {string}
   * @generated Uses ULID for time-sortable unique identifiers
   */
  @PrimaryColumn('varchar', {
    length: 26,
    default: () => `'${ulid()}'`,
  })
  id: string;

  /**
   * The unique name of the role
   * @type {string}
   * @unique
   */
  @Column({ unique: true })
  name: string;

  /**
   * Description of the role's purpose
   * @type {string}
   */
  @Column()
  description: string;

  /**
   * The permissions associated with this role
   * @type {Permission[]}
   */
  @OneToMany(() => Permission, (permission) => permission.role)
  permissions: Permission[];

  /**
   * The user role associations
   * @type {UserRole[]}
   */
  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];
}
