import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

/**
 * Data Transfer Object for pagination parameters
 * Provides a type-safe way to handle pagination and sorting
 */
export class PaginationDto {
  /** Current page number */
  @ApiPropertyOptional({
    type: Number,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  /** Number of items per page */
  @ApiPropertyOptional({
    type: Number,
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 10;

  /** Field to sort by */
  @ApiPropertyOptional({
    type: String,
    description: 'Field to sort results by',
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  /** Sort order */
  @ApiPropertyOptional({
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
