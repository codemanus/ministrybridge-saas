import { Injectable } from '@nestjs/common';
import { FeatureFlagsProvider, type FlagQuery } from './provider.js';

@Injectable()
export class FeatureFlagsService {
  private provider = new FeatureFlagsProvider();

  /**
   * Check if a feature flag is enabled
   */
  async isEnabled(query: FlagQuery): Promise<boolean> {
    return this.provider.isEnabled(query);
  }

  /**
   * Get all feature flags for a context
   */
  async listForContext(ctx: {tenantId?: string; orgId?: string; userId?: string;}): Promise<Record<string, boolean>> {
    return this.provider.listForContext(ctx);
  }

  /**
   * Clear the cache (useful for testing)
   */
  clearCache(): void {
    this.provider.clearCache();
  }
}
