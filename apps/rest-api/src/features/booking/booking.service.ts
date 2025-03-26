import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { ulid } from 'ulid';
import { Booking } from '../database/entities/booking.entity';
import { PaymentBooking } from '../database/entities/payment-booking.entity';
import { Payment } from '../database/entities/payment.entity';
import { Tour } from '../database/entities/tour.entity';
import { User } from '../database/entities/user.entity';
import { BookingStatus } from '../database/enums/booking-status.enum';
import { PaymentStatus } from '../database/enums/payment-status.enum';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { StripeService } from './stripe.service';

/**
 * @class BookingService
 * @description This service handles the business logic for bookings, including creating,
 * finding, updating bookings, and managing payment-related operations.
 * It interacts with the database through TypeORM repositories and integrates with Stripe for payment processing.
 */
@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Tour)
    private tourRepository: Repository<Tour>,
    @InjectRepository(PaymentBooking)
    private paymentBookingRepository: Repository<PaymentBooking>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private stripeService: StripeService
  ) {}

  /**
   * @async
   * @method createBooking
   * @description Creates a new booking for a user, including generating a payment intent with Stripe.
   * @param {User} user - The user creating the booking.
   * @param {CreateBookingDto} createBookingDto - Data for creating the booking.
   * @returns {Promise<{ booking: Booking; clientSecret: string }>} - The created booking and the Stripe client secret.
   * @throws {BadRequestException} - If the tour is not found.
   */
  async createBooking(
    user: User,
    createBookingDto: CreateBookingDto
  ): Promise<{ booking: Booking; clientSecret: string }> {
    // Fetch tour to get the tour price
    const tour = await this.tourRepository.findOne({
      where: { id: createBookingDto.tourId },
    });

    if (!tour) {
      throw new BadRequestException(
        `Tour with ID ${createBookingDto.tourId} not found`
      );
    }

    const totalPrice = tour.price * createBookingDto.participants;
    const referenceNumber = this.generateReferenceNumber(); // Generate ULID for reference number

    // Create a payment intent using Stripe
    const paymentIntent: Stripe.PaymentIntent =
      await this.stripeService.createPaymentIntent(
        totalPrice * 100,
        'usd',
        { bookingId: referenceNumber } // Add bookingId to metadata
      );

    // Save the booking to the DB
    const booking = this.bookingRepository.create({
      userId: user.id,
      tourId: createBookingDto.tourId,
      referenceNumber: referenceNumber,
      specialRequirements: createBookingDto.specialRequirements,
      participants: createBookingDto.participants,
      totalAmount: totalPrice,
      status: BookingStatus.PENDING,
    });

    await this.bookingRepository.save(booking);

    // Create payment
    const payment = this.paymentRepository.create({
      userId: user.id,
      stripePaymentIntentId: paymentIntent.id,
      amount: totalPrice,
      currency: 'usd',
      status: PaymentStatus.PENDING,
    });

    await this.paymentRepository.save(payment);

    // Create payment booking
    const paymentBooking = this.paymentBookingRepository.create({
      bookingId: booking.id,
      paymentId: payment.id,
      amount: totalPrice,
    });

    await this.paymentBookingRepository.save(paymentBooking);

    return { booking: booking, clientSecret: paymentIntent.client_secret };
  }

  /**
   * @async
   * @method findOne
   * @description Finds a booking by its ID.
   * @param {number} id - The ID of the booking to find.
   * @returns {Promise<Booking>} - The found booking.
   * @throws {NotFoundException} - If the booking is not found.
   */
  async findOne(id: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['paymentBookings', 'paymentBookings.payment'], // Include relations for complete data
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  /**
   * @async
   * @method update
   * @description Updates a booking by its ID.
   * @param {number} id - The ID of the booking to update.
   * @param {UpdateBookingDto} updateBookingDto - The data to update the booking with.
   * @returns {Promise<Booking>} - The updated booking.
   * @throws {NotFoundException} - If the booking is not found.
   */
  async update(
    id: number,
    updateBookingDto: UpdateBookingDto
  ): Promise<Booking> {
    const booking = await this.findOne(id);
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    Object.assign(booking, updateBookingDto);
    return this.bookingRepository.save(booking);
  }

  /**
   * @async
   * @method handlePaymentIntentSucceeded
   * @description Handles the successful completion of a Stripe payment intent.
   * Updates the payment status to SUCCEEDED and the booking status to CONFIRMED.
   * @param {string} paymentIntentId - The ID of the Stripe payment intent.
   * @param {string} bookingId - The ID of the associated booking.
   * @param {number} amount - The amount of the payment.
   * @returns {Promise<void>}
   * @throws {NotFoundException} - If the payment is not found.
   * @throws {BadRequestException} - If there is an error updating the booking status.
   */
  async handlePaymentIntentSucceeded(
    paymentIntentId: string,
    bookingId: string,
    amount: number
  ) {
    try {
      const payment = await this.paymentRepository.findOne({
        where: { stripePaymentIntentId: paymentIntentId },
      });
      if (!payment) {
        throw new NotFoundException(
          `Payment with intent ID ${paymentIntentId} not found`
        );
      }
      payment.status = PaymentStatus.SUCCEEDED;
      await this.paymentRepository.save(payment);

      const booking = await this.findOne(parseInt(bookingId)); // Parse bookingId to number
      booking.status = BookingStatus.CONFIRMED;
      await this.bookingRepository.save(booking);
    } catch (error) {
      console.error('Error handling payment intent succeeded:', error);
      throw new BadRequestException(
        'Failed to update booking status after successful payment.'
      );
    }
  }

  /**
   * @async
   * @method handlePaymentIntentFailed
   * @description Handles the failure of a Stripe payment intent.
   * Updates the payment status to FAILED and the booking status to PAYMENT_FAILED.
   * @param {string} paymentIntentId - The ID of the Stripe payment intent.
   * @param {string} bookingId - The ID of the associated booking.
   * @returns {Promise<void>}
   * @throws {NotFoundException} - If the payment is not found.
   * @throws {BadRequestException} - If there is an error updating the booking status.
   */
  async handlePaymentIntentFailed(paymentIntentId: string, bookingId: string) {
    try {
      const payment = await this.paymentRepository.findOne({
        where: { stripePaymentIntentId: paymentIntentId },
      });
      if (!payment) {
        throw new NotFoundException(
          `Payment with intent ID ${paymentIntentId} not found`
        );
      }
      payment.status = PaymentStatus.FAILED;
      await this.paymentRepository.save(payment);

      const booking = await this.findOne(parseInt(bookingId)); // Parse bookingId to number
      booking.status = BookingStatus.PAYMENT_FAILED;
      await this.bookingRepository.save(booking);
    } catch (error) {
      console.error('Error handling payment intent failed:', error);
      throw new BadRequestException(
        'Failed to update booking status after failed payment.'
      );
    }
  }

  /**
   * @method generateReferenceNumber
   * @description Generates a unique reference number using ULID.
   * @returns {string} - The generated reference number.
   */
  generateReferenceNumber(): string {
    return ulid();
  }
}
