import { Controller, Get, Req, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { WorkOSAuth, type JWTSession } from '@packages/auth';
import { getEffectivePermissions } from '@packages/rbac';

@Controller('rbac')
export class RbacController {
  private workosAuth = new WorkOSAuth();

  @Get('effective')
  async effective(@Req() req: Request) {
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

    const set = await getEffectivePermissions({ tenantId: orgId, userId });
    return { permissions: Array.from(set) };
  }
}


