export enum PaymentStatus {
  /**
   * The payment is pending.
   */
  PENDING = 'pending',

  /**
   * The payment has succeeded.
   */
  SUCCEEDED = 'succeeded',

  /**
   * The payment has failed.
   */
  FAILED = 'failed',
  /**
   * The payment has been refunded.
   */
  REFUNDED = 'refunded',
}
