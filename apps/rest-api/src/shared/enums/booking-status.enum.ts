export enum BookingStatus {
  /**
   * The booking is pending confirmation.
   */
  PENDING = 'pending',

  /**
   * The booking has been confirmed.
   */
  CONFIRMED = 'confirmed',

  /**
   * The booking has been canceled.
   */
  CANCELED = 'canceled',

  /**
   * The booking has been completed.
   */
  COMPLETED = 'completed',

  /**
   * The payment for the booking has failed.
   */
  PAYMENT_FAILED = 'payment_failed',
}
