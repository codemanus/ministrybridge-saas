import { WorkOS } from '@workos-inc/node';
import { SignJWT, jwtVerify, JWTPayload } from 'jose';

export interface WorkOSUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  emailVerified: boolean;
  profilePictureUrl?: string;
}

export interface WorkOSOrganization {
  id: string;
  name: string;
  domains?: string[];
  allowedEmailDomains?: string[];
}

export interface WorkOSProfile {
  user: WorkOSUser;
  organization: WorkOSOrganization;
  roleType: string;
}

export interface JWTSession extends JWTPayload {
  sub: string; // user ID
  tenantId: string; // organization ID
  orgId: string; // organization ID (alias for tenantId)
  roles: string[];
}

export type AuthMethod = 'sso' | 'password';

export interface OAuthStatePayload extends JWTPayload {
  method: AuthMethod;
  organizationId?: string;
}

export class WorkOSAuth {
  private workos: WorkOS | null;
  private jwtSecret: Uint8Array;

  constructor() {
    const apiKey = process.env.WORKOS_API_KEY;
    this.workos = apiKey ? new WorkOS(apiKey) : null;
    this.jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-change-in-production');
  }

  async getLoginUrl(organizationId: string, redirectUri: string): Promise<string> {
    if (!this.workos) {
      throw new Error('WorkOS not configured. Set WORKOS_API_KEY and WORKOS_CLIENT_ID to use SSO.');
    }
    return this.workos.sso.getAuthorizationUrl({
      organization: organizationId,
      clientId: process.env.WORKOS_CLIENT_ID!,
      redirectUri: redirectUri,
      state: 'state', // In production, generate a secure random state
    });
  }

  async handleCallback(code: string): Promise<WorkOSProfile> {
    if (!this.workos) {
      throw new Error('WorkOS not configured. Set WORKOS_API_KEY and WORKOS_CLIENT_ID to use SSO.');
    }
    const { profile } = await this.workos.sso.getProfileAndToken({
      code,
      clientId: process.env.WORKOS_CLIENT_ID!,
    });

    return {
      user: {
        id: profile.id,
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        emailVerified: false, // WorkOS doesn't provide this in profile
        profilePictureUrl: undefined, // WorkOS doesn't provide this in profile
      },
      organization: {
        id: profile.organizationId || 'unknown-org',
        name: 'Unknown Organization', // WorkOS doesn't provide org name in profile
        domains: [],
        allowedEmailDomains: [],
      },
      roleType: 'member', // Default role, can be enhanced with organization lookup
    };
  }

  // ---------- User Management (Email + Password) ----------
  async getUserManagementLoginUrl(redirectUri: string): Promise<string> {
    if (!this.workos) {
      throw new Error('WorkOS not configured. Set WORKOS_API_KEY and WORKOS_CLIENT_ID to use User Management.');
    }
    // Hosted Auth (Email+Password) – WorkOS User Management
    return this.workos.userManagement.getAuthorizationUrl({
      provider: 'authkit',
      clientId: process.env.WORKOS_CLIENT_ID!,
      redirectUri,
      state: 'state',
    });
  }

  async handleUserManagementCallback(code: string): Promise<WorkOSProfile> {
    if (!this.workos) {
      throw new Error('WorkOS not configured. Set WORKOS_API_KEY and WORKOS_CLIENT_ID to use User Management.');
    }
    const { user } = await this.workos.userManagement.authenticateWithCode({
      code,
      clientId: process.env.WORKOS_CLIENT_ID!,
    });

    // User Management does not include org in the same shape as SSO; default to placeholder
    return {
      user: {
        id: user.id,
        email: user.email!,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        emailVerified: !!user.emailVerified,
        profilePictureUrl: undefined,
      },
      organization: {
        id: 'unknown-org',
        name: 'Unknown Organization',
        domains: [],
        allowedEmailDomains: [],
      },
      roleType: 'member',
    };
  }

  // ---------- Unified helpers ----------
  async resolveUserOrganization(userId: string): Promise<{ id: string; name: string; roleType?: string } | null> {
    if (!this.workos) {
      return null;
    }
    try {
      // List memberships for this user via User Management
      const memberships = await this.workos.userManagement.listOrganizationMemberships({ userId });
      const items = (memberships?.data as any[]) || [];
      if (items.length === 0) return null;
      const first = items[0];
      // The SDK returns membership objects with organizationId and possibly organization object
      const orgId = first.organizationId || first.organization?.id;
      const orgName = first.organization?.name || 'Organization';
      const roleType = first.role?.slug || first.role?.name || first.role || 'member';
      if (!orgId) return null;
      return { id: orgId, name: orgName, roleType };
    } catch (_e) {
      return null;
    }
  }
  async getUnifiedLoginUrl(params: { method: AuthMethod; organizationId?: string; redirectUri: string }): Promise<string> {
    const { method, organizationId, redirectUri } = params;
    if (method === 'password') {
      return this.getUserManagementLoginUrl(redirectUri);
    }
    if (!organizationId) {
      throw new Error('Organization ID is required for SSO method');
    }
    return this.getLoginUrl(organizationId, redirectUri);
  }

  async handleUnifiedCallback(method: AuthMethod, code: string): Promise<WorkOSProfile> {
    if (method === 'password') {
      return this.handleUserManagementCallback(code);
    }
    return this.handleCallback(code);
  }

  async createSession(profile: WorkOSProfile): Promise<string> {
    const session: JWTSession = {
      sub: profile.user.id,
      tenantId: profile.organization.id,
      orgId: profile.organization.id,
      roles: [profile.roleType],
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
    };

    return new SignJWT(session)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(this.jwtSecret);
  }

  async verifySession(token: string): Promise<JWTSession> {
    const { payload } = await jwtVerify(token, this.jwtSecret);
    return payload as JWTSession;
  }

  // ---------- State utilities ----------
  async createState(payload: { method: AuthMethod; organizationId?: string }, ttlSeconds: number = 600): Promise<string> {
    const state: OAuthStatePayload = {
      method: payload.method,
      organizationId: payload.organizationId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + ttlSeconds,
    };
    return new SignJWT(state)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(`${ttlSeconds}s`)
      .sign(this.jwtSecret);
  }

  async verifyState(token: string): Promise<OAuthStatePayload> {
    const { payload } = await jwtVerify(token, this.jwtSecret);
    return payload as OAuthStatePayload;
  }
}
