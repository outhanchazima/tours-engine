import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Relation,
} from 'typeorm';
import { BookingStatus } from '../enums/booking-status.enum';
import { BaseEntity } from './base.entity';
import { PaymentBooking } from './payment-booking.entity';
import { Payment } from './payment.entity';
import { Tour } from './tour.entity';
import { User } from './user.entity';

/**
 * Represents a booking entity in the system.
 * This entity stores information about tour bookings made by users.
 * @class
 * @entity
 */
@Entity('bookings')
export class Booking extends BaseEntity {
  /**
   * The ID of the user who made the booking.
   * Can be null for anonymous bookings.
   * @type {string}
   */
  @Column({ name: 'user_id', nullable: true })
  userId?: string;

  /**
   * The ID of the tour being booked.
   * @type {string}
   */
  @Column({ name: 'tour_id' })
  tourId: string;

  /**
   * The current status of the booking.
   * Defaults to PENDING status.
   * @type {BookingStatus}
   * @enum {BookingStatus}
   */
  @Column({
    type: 'char',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  /**
   * The number of participants for this booking.
   * @type {number}
   */
  @Column({ type: 'int', default: 1 })
  participants: number;

  /**
   * The total amount for the booking.
   * Stored as decimal with 10 digits and 2 decimal places.
   * @type {number}
   */
  @Column('decimal', { name: 'total_amount', precision: 20, scale: 2 })
  totalAmount: number;

  /**
   * Any special requirements or notes for the booking.
   * Optional field that can contain specific requests.
   * @type {string}
   */
  @Column({ name: 'special_requirements', nullable: true, type: 'text' })
  specialRequirements?: string;

  /**
   * Unique reference number for the booking.
   * Used for external references and customer communication.
   * @type {string}
   */
  @Column({ name: 'reference_number', unique: true })
  referenceNumber: string;

  /**
   * The user who made the booking.
   * Represents the many-to-one relationship with User entity.
   * @type {User}
   */
  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: 'user_id' })
  user?: Relation<User>;

  /**
   * The tour that was booked.
   * Represents the many-to-one relationship with Tour entity.
   * @type {Tour}
   */
  @ManyToOne(() => Tour, (tour) => tour.bookings)
  @JoinColumn({ name: 'tour_id' })
  tour?: Relation<Tour>;

  /**
   * The payments associated with this booking.
   * Represents the one-to-many relationship with Payment entity.
   * @type {Payment[]}
   */
  @OneToMany(() => PaymentBooking, (paymentBooking) => paymentBooking.booking)
  paymentBookings?: Relation<PaymentBooking[]>;
}
