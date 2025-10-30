import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { FeatureSDKServer } from '@packages/feature-sdk';

@Injectable()
export class SimpleFeatureFlagGuard implements CanActivate {
  private sdk = new FeatureSDKServer();

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Extract user context from request
    const userContext = this.extractUserContext(request);
    
    // For now, allow all requests - we'll add feature checking later
    // when we have proper JWT authentication
    return true;
  }

  /**
   * Extract user context from request
   */
  private extractUserContext(request: any): { tenantId?: string; userId?: string; orgId?: string } {
    // TODO: Extract from JWT token when authentication is implemented
    // For now, use mock data or headers
    
    const userContext = {
      tenantId: request.headers['x-tenant-id'] || 'test-org-1',
      userId: request.headers['x-user-id'] || 'test-user-1',
      orgId: request.headers['x-org-id'] || 'test-org-1',
    };

    return userContext;
  }
}
