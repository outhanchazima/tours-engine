import {
  BadRequestException,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  RawBodyRequest,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import Stripe from 'stripe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BookingService } from '../booking/booking.service';
import { StripeService } from '../booking/stripe.service';

@Controller('payment')
export class PaymentsController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly bookingService: BookingService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':paymentIntentId')
  async getPaymentStatus(@Param('paymentIntentId') paymentIntentId: string) {
    try {
      const paymentIntent = await this.stripeService.retrievePaymentIntent(
        paymentIntentId
      );
      return {
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
      };
    } catch (error) {
      throw new BadRequestException('Failed to retrieve payment status');
    }
  }

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

    try {
      switch (event.type) {
        case 'payment_intent.succeeded': {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          await this.bookingService.handlePaymentIntentSucceeded(
            paymentIntent.id,
            paymentIntent.metadata.bookingId,
            paymentIntent.amount
          );
          break;
        }
        case 'payment_intent.payment_failed': {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          await this.bookingService.handlePaymentIntentFailed(
            paymentIntent.id,
            paymentIntent.metadata.bookingId
          );
          break;
        }
        case 'payment_intent.canceled': {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          await this.bookingService.handlePaymentIntentFailed(
            paymentIntent.id,
            paymentIntent.metadata.bookingId
          );
          break;
        }
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    } catch (error) {
      console.error('Error processing webhook:', error);
      throw new BadRequestException('Failed to process webhook event');
    }

    return { received: true };
  }
}
