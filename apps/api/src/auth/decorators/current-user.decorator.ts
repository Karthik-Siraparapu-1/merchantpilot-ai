import { createParamDecorator } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export interface AuthenticatedUserPayload {
  id: string;
  email: string;
  roles: Array<{ merchantId: string; role: string }>;
}

export const CurrentUser = createParamDecorator(
  (data: keyof AuthenticatedUserPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request & { user?: AuthenticatedUserPayload }>();
    const user = request.user;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  }
);
