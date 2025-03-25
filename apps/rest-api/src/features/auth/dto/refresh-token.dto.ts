import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

/**
 * Data Transfer Object for token refresh
 */
export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token',
    example:
      'dadjakdadjlkajor4-tjrnvvmnvgkglskdg[po4tpwtevmms gret4oo-o-2r5223432',
  })
  @IsNotEmpty({ message: 'Refresh token is required' })
  refreshToken: string;
}
