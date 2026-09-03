import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '@merchantpilot/database';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
