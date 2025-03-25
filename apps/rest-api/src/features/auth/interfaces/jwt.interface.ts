import { Request } from 'express';

/**
 * Represents the payload contained in a JWT token
 */
export interface JwtPayload {
  sub: string; // User ID
  email: string;
  roles: string[];
  type: 'access' | 'refresh';
  iat?: number; // Issued at timestamp
  exp?: number; // Expiration timestamp
}

/**
 * Extended request interface to include user information
 */
export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
