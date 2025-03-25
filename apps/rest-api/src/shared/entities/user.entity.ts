import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ulid } from 'ulid';
import { Booking } from './booking.entity';
import { Payment } from './payment.entity';
import { UserRole } from './user-role.entity';

/**
 * User Entity - Represents a user in the tours engine system
 *
 * This entity stores core user information and manages relationships with bookings
 * and payments. It integrates with Keycloak for authentication and supports
 * role-based access control.
 *
 * @entity User
 * @table users
 */
@Entity('users')
export class User {
  /**
   * Unique identifier for the user
   * @type {string}
   * @generated Uses ULID for time-sortable unique identifiers
   */
  @PrimaryColumn('varchar', {
    length: 26,
    default: () => `'${ulid()}'`,
  })
  @Index() // Additional index on primary key for faster lookup
  id: string;

  /**
   * User's unique username
   * @type {string}
   * @unique
   */
  @Column({ unique: true })
  username: string;

  /**
   * User's email address
   * @type {string}
   * @unique
   */
  @Column({ unique: true })
  email: string;

  /**
   * User's first name
   * @type {string}
   * @nullable
   */
  @Column({ name: 'first_name', nullable: true })
  firstName: string;

  /**
   * User's last name
   * @type {string}
   * @nullable
   */
  @Column({ name: 'last_name', nullable: true })
  lastName: string;

  /**
   * Keycloak unique identifier for authentication
   * @type {string}
   * @unique
   */
  @Column({ unique: true })
  keycloakId: string;

  /**
   * User's roles and permissions
   * @type {UserRole[]}
   */
  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];

  /**
   * Timestamp of user creation
   * @type {Date}
   * @generated
   */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  /**
   * Timestamp of last user update
   * @type {Date}
   * @generated
   */
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  /**
   * Soft delete timestamp
   * @type {Date}
   * @nullable
   */
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  /**
   * User's bookings
   * @type {Booking[]}
   * @oneToMany One user can have multiple bookings
   */
  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  /**
   * User's payments
   * @type {Payment[]}
   * @oneToMany One user can have multiple payments
   */
  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];
}
