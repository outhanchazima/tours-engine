import {
  BadRequestException,
  Controller,
  Headers,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import Stripe from 'stripe';
import { BookingService } from '../booking/booking.service';
import { StripeService } from '../booking/stripe.service';

@Controller('payment')
export class PaymentsController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly bookingService: BookingService
  ) {}

  @Post('stripe-webhook')
  async handleWebhook(
    @Req() request: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string
  ) {
    const payload = request.rawBody;

    if (!payload || !signature) {
      throw new BadRequestException('Missing payload or signature');
    }

    let event;
    try {
      event = await this.stripeService.constructEvent(payload, signature);
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntentSucceeded = event.data
          .object as Stripe.PaymentIntent;
        await this.bookingService.handlePaymentIntentSucceeded(
          paymentIntentSucceeded.id,
          paymentIntentSucceeded.metadata.bookingId, // Assuming you set bookingId in metadata
          paymentIntentSucceeded.amount
        );
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntentFailed = event.data.object as Stripe.PaymentIntent;
        await this.bookingService.handlePaymentIntentFailed(
          paymentIntentFailed.id,
          paymentIntentFailed.metadata.bookingId // Assuming you set bookingId in metadata
        );
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }
}
