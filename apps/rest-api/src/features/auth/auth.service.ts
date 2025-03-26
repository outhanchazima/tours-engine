import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { AuthResponseDto } from './dto/login-res.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/jwt.interface';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  /**
   * Generate a new access token
   * @param user User object
   * @returns Access token
   */
  private generateAccessToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      type: 'access',
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m',
    });
  }

  /**
   * Generate a new refresh token
   * @param user User object
   * @returns Refresh token
   */
  private generateRefreshToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      type: 'refresh',
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
    });
  }

  /**
   * Register a new user
   * @param registerDto Registration data transfer object
   * @returns Created user without sensitive information
   */
  async register(registerDto: RegisterDto): Promise<Partial<User>> {
    const { email, username, password, firstName, lastName } = registerDto;
    console.log(registerDto);

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      throw new ConflictException(
        'User with this email or username already exists'
      );
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = this.userRepository.create({
      email,
      username,
      firstName,
      lastName,
      password: hashedPassword, // Store hashed password here
      roles: ['USER'], // Default role
      active: true,
    });

    await this.userRepository.save(user);

    return user;
  }

  /**
   * Authenticate user and generate tokens
   * @param loginDto Login credentials
   * @returns Access and refresh tokens
   */
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email, active: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare provided password with stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    user.lastLogin = new Date();
    await this.userRepository.save(user);

    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        roles: user.roles,
      },
    };
  }

  /**
   * Refresh access token using refresh token
   * @param refreshTokenDto Refresh token DTO
   * @returns New access and refresh tokens
   */
  async refreshTokens(
    refreshTokenDto: RefreshTokenDto
  ): Promise<AuthResponseDto> {
    try {
      // Verify the refresh token
      const payload = this.jwtService.verify(refreshTokenDto.refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      }) as JwtPayload;

      // Ensure this is a refresh token
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Find the user
      const user = await this.userRepository.findOne({
        where: {
          id: payload.sub,
          email: payload.email,
          active: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Generate new tokens
      const newAccessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          roles: user.roles,
        },
      };
    } catch (error) {
      // Handle token verification errors
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Refresh token expired');
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Verify access token
   * @param token Access token
   * @returns Decoded token payload
   */
  async verifyAccessToken(token: string): Promise<JwtPayload> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      }) as JwtPayload;

      // Ensure this is an access token
      if (payload.type !== 'access') {
        throw new UnauthorizedException('Invalid access token');
      }

      return payload;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Access token expired');
      }
      throw new UnauthorizedException('Invalid access token');
    }
  }

  async getProfile(user: User): Promise<User> {
    return await user;
  }
}
