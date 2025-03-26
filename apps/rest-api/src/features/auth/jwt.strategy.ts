import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt.interface';

/**
 * JWT Strategy for passport authentication
 * Validates and extracts user information from JWT tokens
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  /**
   * Validates the JWT payload and retrieves user details
   * @param payload JWT payload containing user information
   * @returns Validated user object
   */
  async validate(payload: JwtPayload) {
    // Ensure this is an access token
    if (payload.type !== 'access') {
      throw new UnauthorizedException('Invalid token type');
    }

    const user = await this.userService.findOneById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return user;
  }
}
