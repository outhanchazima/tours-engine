import { ApiProperty } from '@nestjs/swagger';

/**
 * Response DTO for authentication
 */
export class AuthResponseDto {
  @ApiProperty({ description: 'Access token' })
  accessToken: string;

  @ApiProperty({ description: 'Refresh token' })
  refreshToken: string;

  @ApiProperty({ description: 'User information' })
  user: {
    id: string;
    email: string;
    username: string;
    roles: string[];
  };
}
