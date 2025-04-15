/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private logger: Logger;
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY')
    );
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    metadata?: any
  ): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency,
        automatic_payment_methods: { enabled: true },
        metadata,
      });
      return paymentIntent;
    } catch (error) {
      this.logger.error('Error creating payment intent:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  async constructEvent(
    payload: Buffer,
    signature: string
  ): Promise<Stripe.Event> {
    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      console.error('Error constructing webhook event:', error);
      throw new Error('Failed to construct webhook event');
    }
  }

  async retrievePaymentIntent(
    paymentIntentId: string
  ): Promise<Stripe.PaymentIntent> {
    try {
      return await this.stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      console.error('Error retrieving payment intent:', error);
      throw new Error('Failed to retrieve payment intent');
    }
  }
}
