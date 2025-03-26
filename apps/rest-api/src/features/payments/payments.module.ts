import { Module } from '@nestjs/common';
import { BookingService } from '../booking/booking.service';
import { StripeService } from '../booking/stripe.service';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, BookingService, StripeService],
})
export class PaymentsModule {}
