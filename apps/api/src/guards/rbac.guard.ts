import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { REQUIRED_PERMISSION_KEY } from '../decorators/require-permission.decorator.js';
import { WorkOSAuth, type JWTSession } from '@packages/auth';
import { canAccess } from '@packages/rbac';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  private workosAuth = new WorkOSAuth();

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permission = this.reflector.get<string>(REQUIRED_PERMISSION_KEY, context.getHandler());
    if (!permission) return true; // No permission required

    const req = context.switchToHttp().getRequest<Request>();

    const cookieName = process.env.SESSION_COOKIE_NAME || 'session';
    const sessionToken = (req as any).cookies?.[cookieName];
    if (!sessionToken) throw new UnauthorizedException('No session token found');

    let session: JWTSession;
    try {
      session = await this.workosAuth.verifySession(sessionToken);
    } catch {
      throw new UnauthorizedException('Invalid session token');
    }

    const orgId = session.orgId || session.tenantId;
    const userId = session.sub;

    if (!orgId || !userId) throw new UnauthorizedException('Missing session context');

    return await canAccess({ tenantId: orgId, userId }, permission);
  }
}


