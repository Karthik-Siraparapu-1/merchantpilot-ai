import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly reflector: Reflector;

  constructor(reflector?: Reflector) {
    super();
    this.reflector =
      reflector && typeof reflector.getAllAndOverride === 'function' ? reflector : new Reflector();
  }

  canActivate(context: ExecutionContext) {
    if (this.reflector && typeof this.reflector.getAllAndOverride === 'function') {
      const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass()
      ]);

      if (isPublic) {
        return true;
      }
    }

    return super.canActivate(context);
  }
}
