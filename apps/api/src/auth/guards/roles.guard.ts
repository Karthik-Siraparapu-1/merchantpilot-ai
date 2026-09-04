import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@merchantpilot/database';
import { ROLES_KEY } from '../decorators/roles.decorator';
import type { AuthenticatedUserPayload } from '../decorators/current-user.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly reflector: Reflector;

  constructor(reflector?: Reflector) {
    this.reflector =
      reflector && typeof reflector.getAllAndOverride === 'function' ? reflector : new Reflector();
  }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: AuthenticatedUserPayload }>();
    const user = request.user;

    if (!user || !user.roles) {
      throw new ForbiddenException('Access denied: User authentication required');
    }

    const hasRole = user.roles.some((r) => requiredRoles.includes(r.role as UserRole));

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied: Requires one of roles [${requiredRoles.join(', ')}]`
      );
    }

    return true;
  }
}
