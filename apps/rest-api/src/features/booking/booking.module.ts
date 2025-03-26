import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { StripeService } from './stripe.service';

@Module({
  controllers: [BookingController],
  providers: [BookingService, StripeService],
  exports: [BookingService, StripeService],
})
export class BookingModule {}
