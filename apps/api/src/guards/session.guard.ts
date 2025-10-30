import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { WorkOSAuth } from '@packages/auth';

@Injectable()
export class SessionGuard implements CanActivate {
  private workosAuth = new WorkOSAuth();

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const cookieName = process.env.SESSION_COOKIE_NAME || 'session';
    const token = (req as any).cookies?.[cookieName];

    if (!token) {
      throw new UnauthorizedException('Missing session');
    }

    try {
      const session = await this.workosAuth.verifySession(token);
      (req as any).user = session;
      return true;
    } catch (e) {
      throw new UnauthorizedException('Invalid session');
    }
  }
}


