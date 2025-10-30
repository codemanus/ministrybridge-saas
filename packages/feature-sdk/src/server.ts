import type { FeatureContext, FeatureFlags } from './types.js';

// Temporary mock implementation until workspace compilation is resolved
interface MockFeatureFlagsProvider {
  isEnabled(query: { feature: string; tenantId?: string; orgId?: string; userId?: string }): Promise<boolean>;
  listForContext(query: { tenantId?: string; orgId?: string; userId?: string }): Promise<FeatureFlags>;
  getUserContext(userId: string): Promise<{ orgId?: string; role?: string } | null>;
}

class MockProvider implements MockFeatureFlagsProvider {
  async isEnabled(): Promise<boolean> {
    // Mock implementation - always return true for now
    return true;
  }

  async listForContext(): Promise<FeatureFlags> {
    // Mock implementation - return empty object
    return {};
  }

  async getUserContext(userId: string): Promise<{ orgId?: string; role?: string } | null> {
    // Mock implementation
    return { orgId: 'mock-org', role: 'user' };
  }
}

/**
 * Server-side feature SDK for backend applications
 */
export class FeatureSDKServer {
  private provider: MockFeatureFlagsProvider;

  constructor(provider?: MockFeatureFlagsProvider) {
    this.provider = provider || new MockProvider();
  }

  /**
   * Check if a feature is enabled for the given context
   */
  async isFeatureEnabled(feature: string, context: FeatureContext): Promise<boolean> {
    try {
      return await this.provider.isEnabled({
        feature,
        tenantId: context.tenantId,
        orgId: context.orgId,
        userId: context.userId,
      });
    } catch (error) {
      console.error('Error checking feature flag:', error);
      return false; // Fail safe
    }
  }

  /**
   * Get all features for the given context
   */
  async getFeatures(context: FeatureContext): Promise<FeatureFlags> {
    try {
      return await this.provider.listForContext({
        tenantId: context.tenantId,
        orgId: context.orgId,
        userId: context.userId,
      });
    } catch (error) {
      console.error('Error getting features:', error);
      return {}; // Return empty object on error
    }
  }

  /**
   * Get user context from user ID
   */
  async getUserContext(userId: string): Promise<FeatureContext> {
    try {
      const userContext = await this.provider.getUserContext(userId);
      return {
        userId,
        orgId: userContext?.orgId,
        tenantId: userContext?.orgId, // Assuming tenantId = orgId
        roles: userContext?.role ? [userContext.role] : undefined,
      };
    } catch (error) {
      console.error('Error getting user context:', error);
      return { userId };
    }
  }

  /**
   * Check if user has required role for feature
   */
  async hasFeaturePermission(feature: string, context: FeatureContext): Promise<boolean> {
    // First check if feature is enabled
    const isEnabled = await this.isFeatureEnabled(feature, context);
    if (!isEnabled) {
      return false;
    }

    // TODO: Add role-based permission checks here
    // For now, return true if feature is enabled
    return true;
  }

  /**
   * Get the underlying provider for advanced usage
   */
  getProvider(): MockFeatureFlagsProvider {
    return this.provider;
  }
}
