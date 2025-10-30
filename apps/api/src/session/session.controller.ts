import { Controller, Get, Req, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { WorkOSAuth, type JWTSession } from '@packages/auth';
import { MockFeatureFlagsProvider } from '@packages/flags';

@Controller('session')
export class SessionController {
  private workosAuth = new WorkOSAuth();
  private featureFlags = new MockFeatureFlagsProvider();

  @Get()
  async getSession(@Req() req: Request) {
    const cookieName = process.env.SESSION_COOKIE_NAME || 'session';
    const sessionToken = (req as any).cookies?.[cookieName];

    if (!sessionToken) {
      throw new UnauthorizedException('No session token found');
    }

    try {
      const session: JWTSession = await this.workosAuth.verifySession(sessionToken);

      const features = await this.featureFlags.listForContext({
        tenantId: session.tenantId,
        orgId: session.orgId,
        userId: session.sub,
      });

      return {
        user: {
          id: session.sub,
          tenantId: session.tenantId,
          orgId: session.orgId,
          roles: session.roles,
        },
        features,
      };
    } catch (error) {
      console.error('Session verification error:', error);
      throw new UnauthorizedException('Invalid session token');
    }
  }
}
