import type { FlagQuery, FlagsProvider } from './provider.js';

/**
 * Mock feature flags provider for testing without database
 */
export class MockFeatureFlagsProvider implements FlagsProvider {
  private mockFlags: Record<string, boolean> = {
    'ui-base': true,
    'ui-campus': false,
    'ui-groups': false,
    'ui-students': false,
    'ui-tech-prod': false,
  };

  async isEnabled(query: FlagQuery): Promise<boolean> {
    // Simple mock implementation
    return this.mockFlags[query.feature] ?? false;
  }

  async listForContext(ctx: {tenantId?: string; orgId?: string; userId?: string;}): Promise<Record<string, boolean>> {
    return { ...this.mockFlags };
  }

  /**
   * Set a mock flag value for testing
   */
  setMockFlag(feature: string, enabled: boolean): void {
    this.mockFlags[feature] = enabled;
  }

  /**
   * Reset all flags to defaults
   */
  resetToDefaults(): void {
    this.mockFlags = {
      'ui-base': true,
      'ui-campus': false,
      'ui-groups': false,
      'ui-students': false,
      'ui-tech-prod': false,
    };
  }
}
