import { createParamDecorator } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export const TenantId = createParamDecorator((_data: unknown, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest<Request>();
  const header = request.headers['x-tenant-id'];
  if (Array.isArray(header)) {
    return header[0] ?? '';
  }
  return header ?? '';
});
