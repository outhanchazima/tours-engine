import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../../shared/decorators/public.decorator';
import { Roles } from '../../shared/decorators/roles.decorator';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/login-res.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { AuthenticatedRequest } from './interfaces/jwt.interface';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * User registration endpoint
   * @param registerDto User registration details
   * @returns Registered user information
   */
  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists',
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * User login endpoint
   * @param loginDto User login credentials
   * @returns Access and refresh tokens
   */
  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Login and obtain tokens' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  /**
   * Refresh access token
   * @param refreshTokenDto Refresh token
   * @returns New access and refresh tokens
   */
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Tokens refreshed successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired refresh token',
  })
  async refreshTokens(
    @Body() refreshTokenDto: RefreshTokenDto
  ): Promise<AuthResponseDto> {
    return this.authService.refreshTokens(refreshTokenDto);
  }

  // /**
  //  * Logout endpoint
  //  * @param refreshTokenDto Refresh token to invalidate
  //  */
  // @Post('logout')
  // @ApiOperation({ summary: 'Logout and invalidate refresh token' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Logged out successfully',
  // })
  // async logout(@Body() refreshTokenDto: RefreshTokenDto): Promise<void> {
  //   return this.authService.logout(refreshTokenDto.refreshToken);
  // }

  /**
   * Get authenticated user profile
   * Requires valid JWT token
   * @param req Authenticated request
   * @returns User profile
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getProfile(@Request() req: AuthenticatedRequest) {
    return await this.authService.getProfile(req.user);
  }
}
