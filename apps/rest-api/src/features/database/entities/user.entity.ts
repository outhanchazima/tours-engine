import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Booking } from './booking.entity';
import { Payment } from './payment.entity';

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
export class User extends BaseEntity {
  /**
   * User's unique username
   * @type {string}
   * @unique
   */
  @Column({ unique: true, nullable: false })
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
   * User's phone number
   * @type {string}
   * @nullable
   */
  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  /**
   * Password hashed for security
   * @type {string}
   * @unique
   */
  @Column({ nullable: true })
  @ApiHideProperty()
  @Exclude() // Will not appear in the response
  password: string;

  /**
   * Is user active
   * @type {boolean}
   * @default true
   */
  @Column({ default: true })
  active: boolean;

  /**
   * User's roles
   * @type {string[]}
   * @nullable
   */
  @Column('simple-array', { nullable: true })
  roles: string[];

  /**
   * User's metadata
   * @type {Record<string, any>}
   * @nullable
   *
   * @example
   * {
   *  "preferred_language": "en",
   * "timezone": "America/New_York"
   * }
   */
  @Column({ type: 'simple-json', nullable: true })
  metadata?: Record<string, unknown>;

  /**
   * User's last login timestamp
   * @type {Date}
   * @nullable
   */
  @Column({ nullable: true })
  lastLogin?: Date;

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
