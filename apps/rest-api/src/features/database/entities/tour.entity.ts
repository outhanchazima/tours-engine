import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Booking } from './booking.entity';
import { User } from './user.entity';

/**
 * Represents a tour offering in the system.
 * This entity stores all information related to a bookable tour, including its
 * details, pricing, capacity, and relationships with users and bookings.
 *
 * @entity Tour
 */
@Entity('tours')
@Index(['isActive', 'capacity']) // Index for filtering active tours with capacity
@Check('"price" >= 0') // Ensure price is non-negative
@Check('"capacity" >= 0') // Ensure capacity is non-negative
export class Tour extends BaseEntity {
  /**
   * The display title of the tour.
   * @type {string}
   */
  @Column()
  title?: string;

  /**
   * Geographic location where the tour takes place.
   * Indexed for efficient location-based searches.
   * @type {string}
   */
  @Column({ nullable: true })
  @Index() // Fast filtering of tours by location
  location?: string;

  /**
   * Detailed description of the tour, including itinerary and highlights.
   * @type {string}
   */
  @Column('text')
  description?: string;

  /**
   * Duration of the tour in days.
   * @type {number}
   */
  @Column()
  duration?: number; // in days

  /**
   * Price of the tour with decimal precision (10,2).
   * Automatically rounded to 2 decimal places.
   * Non-negative values enforced by database constraint.
   * @type {number}
   */
  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  @Index()
  price: number;

  /**
   * Currency code for the tour price (e.g., 'USD', 'EUR').
   * @type {string}
   */
  @Column()
  currency: string;

  /**
   * Array of URLs pointing to tour images.
   * @type {string[]}
   */
  @Column({ type: 'varchar', array: true, default: [] })
  imageUrls: string[];

  /**
   * Indicates if the tour is currently active and bookable.
   * Cannot be updated directly through normal updates.
   * @type {boolean}
   * @default true
   */
  @Column({
    default: true,
    type: 'boolean',
    update: false, // Prevents accidental updates
  })
  @Index() // Fast filtering of active tours
  isActive: boolean;

  /**
   * Maximum number of participants allowed on the tour.
   * Non-negative values enforced by database constraint and transformer.
   * @type {number}
   * @default 0
   */
  @Column({
    default: 0,
    type: 'int',
    transformer: {
      to: (value: number) => Math.max(0, value),
      from: (value: number) => value,
    },
  })
  @Index() // Quick capacity-based queries
  capacity: number;

  /**
   * Reference to the user who created the tour.
   * Cascades on insert but not eagerly loaded.
   * @type {User}
   */
  @ManyToOne(() => User, {
    nullable: true,
    cascade: ['insert'],
    eager: false, // Prevent automatic joining
  })
  @JoinColumn({ name: 'created_by_user_id' })
  @Index() // Quick user-based tour queries
  createdBy?: User;

  /**
   * Collection of bookings associated with this tour.
   * One-to-many relationship with Booking entity.
   * @type {Booking[]}
   */
  @OneToMany(() => Booking, (booking) => booking.tour)
  bookings: Booking[];
}
