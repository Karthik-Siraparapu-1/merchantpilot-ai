import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException
} from '@nestjs/common';
import type { Request } from 'express';
import type { AuthenticatedUserPayload } from '../decorators/current-user.decorator';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: AuthenticatedUserPayload }>();
    const tenantIdHeader = request.headers['x-tenant-id'];

    if (!tenantIdHeader || typeof tenantIdHeader !== 'string') {
      throw new BadRequestException('Missing required HTTP header: x-tenant-id');
    }

    const user = request.user;
    if (!user || !user.roles) {
      throw new ForbiddenException('Access denied: Authentication context missing');
    }

    const isAuthorizedTenant = user.roles.some((r) => r.merchantId === tenantIdHeader);

    if (!isAuthorizedTenant) {
      throw new ForbiddenException(
        `Access denied: User is not authorized for merchant tenant ${tenantIdHeader}`
      );
    }

    return true;
  }
}
