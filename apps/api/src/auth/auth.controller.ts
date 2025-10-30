import { Controller, Get, Query, Res, Req, HttpException, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
import { WorkOSAuth, type WorkOSProfile, type AuthMethod } from '@packages/auth';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  private workosAuth: WorkOSAuth;

  constructor(private authService: AuthService) {
    this.workosAuth = new WorkOSAuth();
  }

  @Get('login')
  async login(@Query('org') organizationId: string, @Query('method') methodQuery: string, @Res() res: Response) {
    const method: AuthMethod = (methodQuery === 'password' ? 'password' : 'sso');

    const hasWorkOS = !!process.env.WORKOS_API_KEY && !!process.env.WORKOS_CLIENT_ID;

    if (hasWorkOS) {
      const redirectUri = `${process.env.API_BASE_URL || 'http://localhost:4000'}/auth/callback`;

      // For SSO we still require org; if missing and method is sso, error out gracefully
      if (method === 'sso' && !organizationId) {
        throw new HttpException('Organization ID is required for SSO login', HttpStatus.BAD_REQUEST);
      }

      try {
        // Create state and set short-lived cookie for CSRF protection
        const state = await this.workosAuth.createState({ method, organizationId });
        res.cookie('oauth_state', state, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 10 * 60 * 1000, // 10 minutes
          path: '/',
        });

        const loginUrl = await this.workosAuth.getUnifiedLoginUrl({ method, organizationId, redirectUri });
        console.log('[auth/login] method:', method, 'org:', organizationId, 'redirectUri:', redirectUri);
        console.log('[auth/login] redirecting to:', loginUrl);
        return res.redirect(loginUrl + `&state=${encodeURIComponent(state)}`);
      } catch (e: any) {
        console.error('[auth/login] failed to create WorkOS authorization URL:', e?.message || e);
        throw new HttpException('Failed to initiate login', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    // Fallback: redirect to shell app's mock login route
    const shellUrl = process.env.SHELL_BASE_URL || 'http://localhost:3000';
    const qs = new URLSearchParams();
    if (organizationId) qs.set('org', organizationId);
    if (method) qs.set('method', method);
    return res.redirect(`${shellUrl}/login?${qs.toString()}`);
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Query('state') returnedState: string, @Res() res: Response) {
    if (!code && process.env.WORKOS_API_KEY && process.env.WORKOS_CLIENT_ID) {
      throw new HttpException('Authorization code is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const cookieName = process.env.SESSION_COOKIE_NAME || 'session';
      const shellUrl = process.env.SHELL_BASE_URL || 'http://localhost:3000';

      const hasWorkOS = !!process.env.WORKOS_API_KEY && !!process.env.WORKOS_CLIENT_ID;

      let profile: WorkOSProfile;

      if (hasWorkOS) {
        // If state was used (server-initiated), validate it; otherwise, proceed (frontend-initiated)
        const cookieState = (res as any).req?.cookies?.['oauth_state'];
        let method: AuthMethod = 'sso';
        if (returnedState && cookieState) {
          await this.workosAuth.verifyState(returnedState);
          const decoded = await this.workosAuth.verifyState(cookieState);
          method = decoded.method || 'sso';
        } else {
          // Infer method: if no org provided we assume password flow
          method = 'password';
        }

        // Real WorkOS callback based on method
        profile = await this.workosAuth.handleUnifiedCallback(method, code);

        // For AuthKit (password) logins, attempt to resolve organization via memberships
        if (method === 'password' && profile?.user?.id) {
          const resolved = await this.workosAuth.resolveUserOrganization(profile.user.id);
          if (resolved) {
            profile.organization.id = resolved.id;
            profile.organization.name = resolved.name;
            if (resolved.roleType) {
              profile.roleType = resolved.roleType;
            }
          }
        }

        console.log('[auth/callback] method:', method, 'user:', profile.user?.id, 'org:', profile.organization?.id);
        // Upsert user/org is best-effort; do not fail login if it throws
        try {
          await this.authService.upsertUserAndOrganization(profile);
        } catch (e) {
          console.warn('[auth/callback] upsertUserAndOrganization failed:', (e as any)?.message || e);
        }
      } else {
        // Mock profile when WorkOS is not configured
        profile = {
          user: {
            id: 'mock-user-id',
            email: 'mock@example.com',
            firstName: 'Mock',
            lastName: 'User',
            emailVerified: true,
            profilePictureUrl: undefined,
          },
          organization: {
            id: 'mock-org-id',
            name: 'Mock Org',
            domains: [],
            allowedEmailDomains: [],
          },
          roleType: 'admin',
        };
      }

      // Create a signed session JWT
      const sessionToken = await this.workosAuth.createSession(profile);

      // Set httpOnly cookie (Max-Age in seconds)
      res.cookie(cookieName, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60, // 24 hours (seconds)
        path: '/',
      });

      return res.redirect(shellUrl);
    } catch (error) {
      console.error('Auth callback error:', error);
      throw new HttpException('Authentication failed', HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('logout')
  async logout(@Res() res: Response) {
    const cookieName = process.env.SESSION_COOKIE_NAME || 'session';
    res.clearCookie(cookieName, { path: '/' });
    const shellUrl = process.env.SHELL_BASE_URL || 'http://localhost:3000';
    return res.redirect(shellUrl);
  }
}
