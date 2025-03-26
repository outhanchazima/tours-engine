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
import { Tour } from '../database/entities/tour.entity';
import { User } from '../database/entities/user.entity';
import { BookingStatus } from '../database/enums/booking-status.enum';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { StripeService } from './stripe.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Tour)
    private tourRepository: Repository<Tour>,
    @InjectRepository(PaymentBooking)
    private paymentBookingRepository: Repository<PaymentBooking>,
    private stripeService: StripeService
  ) {}

  async createBooking(
    user: User,
    createBookingDto: CreateBookingDto
  ): Promise<{ booking: Booking; clientSecret: string }> {
    // Fetch tour to get the tourprice
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

    console.log('Paymnet Intent', paymentIntent);
    console.log(referenceNumber);

    // Save the booking to the DB
    const booking = this.bookingRepository.create({
      userId: user.id,
      tou: tour.id,
      participants: createBookingDto.participants,
      paymentId: paymentIntent.id,
      totalAmount: totalPrice,
      status: BookingStatus.PENDING,
      referenceNumber,
    });

    await this.bookingRepository.save(booking);

    return { booking: booking, clientSecret: paymentIntent.client_secret };
  }

  async findOne(id: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['paymentBookings', 'payments'], // Include relations for complete data
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

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

  async handlePaymentIntentSucceeded(
    paymentIntentId: string,
    bookingId: string,
    amount: number
  ) {
    try {
      const paymentBooking = this.paymentBookingRepository.create({
        bookingId,
        amount,
        paymentId: paymentIntentId, // Assuming paymentId is a string
      });
      await this.paymentBookingRepository.save(paymentBooking);
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

  async handlePaymentIntentFailed(paymentIntentId: string, bookingId: string) {
    try {
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

  generateReferenceNumber(): string {
    return ulid();
  }
}
