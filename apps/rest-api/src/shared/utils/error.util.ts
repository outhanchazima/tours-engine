/**
 * Custom application error class that extends the native Error class.
 * Provides standardized error handling with HTTP status codes and additional metadata.
 *
 * @class AppError
 * @extends {Error}
 * @example
 * throw new AppError('Something went wrong', 500, 'ERR_INTERNAL', { detail: 'error detail' });
 */
export class AppError extends Error {
  /**
   * Creates a new AppError instance
   * @param {string} message - Error message describing what went wrong
   * @param {number} statusCode - HTTP status code (defaults to 500)
   * @param {string} [code] - Optional error code for more specific error identification
   * @param {any} [details] - Optional additional error details or metadata
   */
  constructor(
    public override readonly message: string,
    public readonly statusCode: number = 500,
    public readonly code?: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public readonly details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }

  /**
   * Creates a 400 Bad Request error
   * @param {string} message - Error message describing the bad request
   * @param {string} [code] - Optional error code
   * @param {any} [details] - Optional additional error details
   * @returns {AppError} New AppError instance with 400 status code
   * @example
   * throw AppError.badRequest('Invalid input data', 'ERR_VALIDATION', { field: 'email' });
   */
  static badRequest(message: string, code?: string, details?: any): AppError {
    return new AppError(message, 400, code, details);
  }

  /**
   * Creates a 401 Unauthorized error
   * @param {string} message - Error message describing the authentication failure
   * @param {string} [code] - Optional error code
   * @param {any} [details] - Optional additional error details
   * @returns {AppError} New AppError instance with 401 status code
   * @example
   * throw AppError.unauthorized('Invalid credentials', 'ERR_AUTH');
   */
  static unauthorized(message: string, code?: string, details?: any): AppError {
    return new AppError(message, 401, code, details);
  }

  /**
   * Creates a 403 Forbidden error
   * @param {string} message - Error message describing the permission issue
   * @param {string} [code] - Optional error code
   * @param {any} [details] - Optional additional error details
   * @returns {AppError} New AppError instance with 403 status code
   * @example
   * throw AppError.forbidden('Insufficient permissions', 'ERR_ACCESS');
   */
  static forbidden(message: string, code?: string, details?: any): AppError {
    return new AppError(message, 403, code, details);
  }

  /**
   * Creates a 404 Not Found error
   * @param {string} message - Error message describing what resource wasn't found
   * @param {string} [code] - Optional error code
   * @param {any} [details] - Optional additional error details
   * @returns {AppError} New AppError instance with 404 status code
   * @example
   * throw AppError.notFound('User not found', 'ERR_USER_404', { userId: 123 });
   */
  static notFound(message: string, code?: string, details?: any): AppError {
    return new AppError(message, 404, code, details);
  }

  /**
   * Creates a 409 Conflict error
   * @param {string} message - Error message describing the conflict
   * @param {string} [code] - Optional error code
   * @param {any} [details] - Optional additional error details
   * @returns {AppError} New AppError instance with 409 status code
   * @example
   * throw AppError.conflict('Email already exists', 'ERR_DUPLICATE_EMAIL');
   */
  static conflict(message: string, code?: string, details?: any): AppError {
    return new AppError(message, 409, code, details);
  }

  /**
   * Creates a 500 Internal Server Error
   * @param {string} message - Error message describing the internal error
   * @param {string} [code] - Optional error code
   * @param {any} [details] - Optional additional error details
   * @returns {AppError} New AppError instance with 500 status code
   * @example
   * throw AppError.internal('Database connection failed', 'ERR_DB', { dbError: error });
   */
  static internal(message: string, code?: string, details?: any): AppError {
    return new AppError(message, 500, code, details);
  }
}
