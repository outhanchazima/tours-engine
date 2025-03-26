import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

/**
 * Decorator to add pagination-related Swagger documentation to an endpoint
 *
 * @param {Object} [options] - Configuration options for pagination
 * @param {boolean} [options.optional=true] - Whether pagination parameters are optional
 * @returns {MethodDecorator & ClassDecorator} Decorator for adding pagination documentation
 *
 * @example
 * ```typescript
 * @Get()
 * @Paginate() // Adds default optional pagination
 * @Paginate({ optional: false }) // Makes pagination parameters required
 * async findAll(@Query() query: PaginationDto) {
 *   // Method implementation
 * }
 * ```
 */
export function Paginate(options: { optional?: boolean } = {}) {
  const { optional = true } = options;

  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: !optional,
      type: Number,
      description: 'Page number for pagination (default: 1)',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: !optional,
      type: Number,
      description: 'Number of items per page (default: 10)',
      example: 10,
    }),
    ApiQuery({
      name: 'sortBy',
      required: false,
      type: String,
      description: 'Field to sort results by',
      example: 'createdAt',
    }),
    ApiQuery({
      name: 'sortOrder',
      required: false,
      enum: ['ASC', 'DESC'],
      description: 'Sort order (ascending or descending)',
      example: 'DESC',
    })
  );
}

/**
 * Decorator to add filtering-related Swagger documentation to an endpoint
 *
 * @param {string[]} fields - List of fields that can be filtered
 * @returns {MethodDecorator & ClassDecorator} Decorator for adding filter documentation
 *
 * @example
 * ```typescript
 * @Get()
 * @Filterable(['name', 'email', 'status'])
 * async findAll(@Query() query: FilterDto) {
 *   // Method implementation
 * }
 * ```
 */
export function Filterable(fields: string[]) {
  return applyDecorators(
    ...fields.map((field) =>
      ApiQuery({
        name: field,
        required: false,
        type: String,
        description: `Filter by ${field}`,
      })
    )
  );
}
