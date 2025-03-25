import { SetMetadata } from '@nestjs/common';

/**
 * Custom decorator to specify roles for route authorization
 * @param roles List of allowed roles
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
