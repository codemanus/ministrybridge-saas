import { WorkOS } from '@workos-inc/node';
import { SignJWT, jwtVerify } from 'jose';
export class WorkOSAuth {
    workos;
    jwtSecret;
    constructor() {
        this.workos = new WorkOS(process.env.WORKOS_API_KEY);
        this.jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-change-in-production');
    }
    async getLoginUrl(organizationId, redirectUri) {
        return this.workos.sso.getAuthorizationUrl({
            organization: organizationId,
            clientId: process.env.WORKOS_CLIENT_ID,
            redirectUri: redirectUri,
            state: 'state', // In production, generate a secure random state
        });
    }
    async handleCallback(code) {
        const { profile } = await this.workos.sso.getProfileAndToken({
            code,
            clientId: process.env.WORKOS_CLIENT_ID,
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
    async createSession(profile) {
        const session = {
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
    async verifySession(token) {
        const { payload } = await jwtVerify(token, this.jwtSecret);
        return payload;
    }
}
