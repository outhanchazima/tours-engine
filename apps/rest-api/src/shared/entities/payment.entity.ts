import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentStatus } from '../enums/payment-status.enum';
import { PaymentBooking } from './payment-booking.entity';
import { User } from './user.entity';

/**
 * Payment entity represents a financial transaction in the system.
 * It stores information about payments made by users for their bookings,
 * including Stripe integration details and payment status.
 */
@Entity('payments')
export class Payment {
  /**
   * Unique identifier for the payment
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Reference to the user who made the payment
   */
  @Column()
  userId: string;

  /**
   * Stripe payment intent ID for tracking the payment in Stripe
   */
  @Column({ nullable: true })
  stripePaymentIntentId: string;

  /**
   * Stripe customer ID for the user making the payment
   */
  @Column({ nullable: true })
  stripeCustomerId: string;

  /**
   * Payment amount with 2 decimal precision
   */
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  /**
   * Currency code for the payment (e.g., 'USD', 'EUR')
   */
  @Column()
  currency: string;

  /**
   * Current status of the payment
   */
  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  /**
   * Reason for payment failure, if any
   */
  @Column({ nullable: true })
  failureReason: string;

  /**
   * Timestamp when the payment record was created
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Timestamp when the payment record was last updated
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Relationship to the User entity
   * Many payments can belong to one user
   */
  @ManyToOne(() => User, (user) => user.payments)
  @JoinColumn({ name: 'userId' })
  user: User;

  /**
   * Relationship to track all bookings associated with this payment
   */
  @OneToMany(() => PaymentBooking, (paymentBooking) => paymentBooking.payment)
  paymentBookings: PaymentBooking[];
}
