import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Booking } from './booking.entity';
import { Payment } from './payment.entity';

/**
 * @class PaymentBooking
 * @classdesc Represents the join table entity for the many-to-many relationship between Payment and Booking.
 * This entity stores the association between a payment and one or more bookings,
 * along with the amount paid for each booking.
 * @extends BaseEntity
 * @entity payment_bookings
 */
@Entity('payment_bookings')
export class PaymentBooking extends BaseEntity {
  /**
   * @property {string} paymentId - The ID of the payment associated with this booking.
   * @column
   */
  @Column()
  paymentId: string;

  /**
   * @property {string} bookingId - The ID of the booking associated with this payment.
   * @column
   */
  @Column()
  bookingId: string;

  /**
   * @property {number} amount - The amount paid for this specific booking.
   * @column
   */
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  /**
   * @property {Relation<Payment>} payment - The Payment entity associated with this PaymentBooking.
   * @manyToOne - Establishes a many-to-one relationship with the Payment entity.
   * @joinColumn - Specifies the foreign key column 'paymentId' for this relationship.
   */
  @ManyToOne(() => Payment, (payment) => payment.paymentBookings)
  @JoinColumn({ name: 'paymentId' })
  payment: Relation<Payment>;

  /**
   * @property {Relation<Booking>} booking - The Booking entity associated with this PaymentBooking.
   * @manyToOne - Establishes a many-to-one relationship with the Booking entity.
   * @joinColumn - Specifies the foreign key column 'bookingId' for this relationship.
   */
  @ManyToOne(() => Booking, (booking) => booking.paymentBookings)
  @JoinColumn({ name: 'bookingId' })
  booking: Relation<Booking>;
}
