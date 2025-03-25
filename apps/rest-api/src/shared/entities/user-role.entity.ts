import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Role } from './role.entity';
import { User } from './user.entity';

/**
 * UserRole Entity - Represents the many-to-many relationship between users and roles
 *
 * This entity manages the association between users and their assigned roles in the system,
 * enabling role-based access control (RBAC).
 *
 * @entity UserRole
 * @table user_roles
 */
@Entity('user_roles')
export class UserRole {
  /**
   * The user's unique identifier
   * @type {string}
   */
  @PrimaryColumn('varchar', { length: 26 })
  userId: string;

  /**
   * The role's unique identifier
   * @type {string}
   */
  @PrimaryColumn('varchar', { length: 26 })
  roleId: string;

  /**
   * The associated user
   * @type {User}
   */
  @ManyToOne(() => User, (user) => user.userRoles)
  user: User;

  /**
   * The associated role
   * @type {Role}
   */
  @ManyToOne(() => Role, (role) => role.userRoles)
  role: Role;
}
