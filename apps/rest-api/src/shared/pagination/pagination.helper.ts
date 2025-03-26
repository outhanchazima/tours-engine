import { FindManyOptions, SelectQueryBuilder } from 'typeorm';
import { PaginationDto } from './pagination.dto';

/**
 * Pagination helper class to manage complex pagination and filtering scenarios
 */
export class PaginationHelper {
  /**
   * Formats pagination options for TypeORM queries
   *
   * @template T - Entity type
   * @param {PaginationDto} query - Pagination parameters
   * @param {string[]} [relations=[]] - Related entities to load
   * @returns {FindManyOptions<T>} Formatted TypeORM query options
   *
   * @example
   * ```typescript
   * const options = PaginationHelper.formatPaginationOptions<User>(
   *   { page: 2, limit: 20, sortBy: 'createdAt', sortOrder: 'DESC' },
   *   ['profile']
   * );
   * ```
   */
  static formatPaginationOptions<T>(
    query: PaginationDto,
    relations: string[] = []
  ): FindManyOptions<T> {
    const { page = 1, limit = 10, sortBy, sortOrder } = query;

    return {
      take: limit,
      skip: (page - 1) * limit,
      order: sortBy ? { [sortBy]: sortOrder } : {},
      relations,
    };
  }

  /**
   * Advanced method to apply filters to a query builder
   *
   * @template T - Entity type
   * @param {SelectQueryBuilder<T>} queryBuilder - TypeORM query builder
   * @param {Record<string, any>} filters - Filters to apply
   * @param {Object} [options] - Additional filtering options
   * @returns {SelectQueryBuilder<T>} Modified query builder
   *
   * @example
   * ```typescript
   * const filteredQuery = PaginationHelper.applyFilters(
   *   userRepository.createQueryBuilder('user'),
   *   {
   *     name: 'John',
   *     status: 'active'
   *   },
   *   {
   *     // Optional advanced filtering
   *     partialMatch: ['name']
   *   }
   * );
   * ```
   */
  static applyFilters<T>(
    queryBuilder: SelectQueryBuilder<T>,
    filters: Record<string, any>,
    options: {
      partialMatch?: string[];
      exactMatch?: string[];
    } = {}
  ): SelectQueryBuilder<T> {
    const { partialMatch = [], exactMatch = [] } = options;

    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      // Partial match for specified fields
      if (partialMatch.includes(key)) {
        queryBuilder.andWhere(`${queryBuilder.alias}.${key} LIKE :${key}`, {
          [key]: `%${value}%`,
        });
      }
      // Exact match for specified or default fields
      else if (exactMatch.includes(key) || !partialMatch.length) {
        queryBuilder.andWhere(`${queryBuilder.alias}.${key} = :${key}`, {
          [key]: value,
        });
      }
    });

    return queryBuilder;
  }

  /**
   * Creates a standardized paginated response
   *
   * @template T - Data type
   * @param {T[]} data - Paginated data
   * @param {number} total - Total number of items
   * @param {PaginationDto} query - Pagination parameters
   * @returns {PaginatedResponseDto<T>} Formatted paginated response
   *
   * @example
   * ```typescript
   * const response = PaginationHelper.createPaginatedResponse(
   *   users,
   *   totalUserCount,
   *   { page: 2, limit: 15 }
   * );
   * ```
   */
  static createPaginatedResponse<T>(
    data: T[],
    total: number,
    query: PaginationDto
  ): PaginatedResponseDto<T> {
    const { page = 1, limit = 10 } = query;

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

/**
 * Standardized paginated response DTO
 * @template T - Type of data in the response
 */
export interface PaginatedResponseDto<T> {
  /** Paginated data */
  data: T[];
  /** Pagination metadata */
  meta: {
    /** Total number of items */
    total: number;
    /** Current page number */
    page: number;
    /** Number of items per page */
    limit: number;
    /** Total number of pages */
    totalPages: number;
  };
}
