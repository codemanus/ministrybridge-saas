import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { FeatureSDKServer } from '@packages/feature-sdk';

@Injectable()
export class FeatureFlagGuard implements CanActivate {
  private sdk = new FeatureSDKServer();

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Extract feature from route metadata or request
    const feature = this.extractFeatureFromRequest(request);
    
    if (!feature) {
      // If no feature specified, allow access
      return true;
    }

    // Extract user context from request
    const userContext = this.extractUserContext(request);
    
    // Check if feature is enabled
    const isEnabled = await this.sdk.isFeatureEnabled(feature, userContext);
    
    if (!isEnabled) {
      throw new ForbiddenException(`Feature '${feature}' is not enabled for this user`);
    }

    return true;
  }

  /**
   * Extract feature name from request
   */
  private extractFeatureFromRequest(request: any): string | null {
    // Check if feature is specified in route metadata
    const handler = request.route?.stack?.[0]?.handle;
    if (handler?.feature) {
      return handler.feature;
    }

    // Check if feature is specified in request headers
    const featureHeader = request.headers['x-feature-flag'];
    if (featureHeader) {
      return featureHeader;
    }

    // Extract from route path (e.g., /campus/* -> ui-campus)
    const path = request.route?.path;
    if (path) {
      return this.mapPathToFeature(path);
    }

    return null;
  }

  /**
   * Map route path to feature flag
   */
  private mapPathToFeature(path: string): string | null {
    const pathToFeatureMap: Record<string, string> = {
      '/campus': 'ui-campus',
      '/groups': 'ui-groups',
      '/students': 'ui-students',
      '/tech': 'ui-tech-prod',
      '/base': 'ui-base',
    };

    // Find matching path
    for (const [routePath, feature] of Object.entries(pathToFeatureMap)) {
      if (path.startsWith(routePath)) {
        return feature;
      }
    }

    return null;
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
