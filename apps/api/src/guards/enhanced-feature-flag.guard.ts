import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FeatureSDKServer } from '@packages/feature-sdk';
import { REQUIRE_FEATURE_KEY } from '../decorators/require-feature.decorator.js';

@Injectable()
export class EnhancedFeatureFlagGuard implements CanActivate {
  private sdk = new FeatureSDKServer();

  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Check if feature is required via decorator
    const requiredFeature = this.reflector.getAllAndOverride<string>(
      REQUIRE_FEATURE_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (requiredFeature) {
      const userContext = this.extractUserContext(request);
      const isEnabled = await this.sdk.isFeatureEnabled(requiredFeature, userContext);
      
      if (!isEnabled) {
        throw new ForbiddenException(`Feature '${requiredFeature}' is not enabled for this user`);
      }
    }

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
