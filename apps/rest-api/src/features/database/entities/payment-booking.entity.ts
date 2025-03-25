import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Booking } from './booking.entity';
import { Payment } from './payment.entity';

/**
 * Join entity that represents the relationship between payments and bookings
 * Allows tracking which portion of a payment applies to which booking
 */
@Entity('payment_bookings')
export class PaymentBooking extends BaseEntity {
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  paymentId: number;

  @Column()
  bookingId: string;

  @ManyToOne(() => Payment, (payment) => payment.paymentBookings)
  @JoinColumn({ name: 'paymentId' })
  payment: Payment;

  @ManyToOne(() => Booking, (booking) => booking.paymentBookings)
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;
}
