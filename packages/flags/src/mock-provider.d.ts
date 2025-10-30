import type { FlagQuery, FlagsProvider } from './provider.js';
/**
 * Mock feature flags provider for testing without database
 */
export declare class MockFeatureFlagsProvider implements FlagsProvider {
    private mockFlags;
    isEnabled(query: FlagQuery): Promise<boolean>;
    listForContext(ctx: {
        tenantId?: string;
        orgId?: string;
        userId?: string;
    }): Promise<Record<string, boolean>>;
    /**
     * Set a mock flag value for testing
     */
    setMockFlag(feature: string, enabled: boolean): void;
    /**
     * Reset all flags to defaults
     */
    resetToDefaults(): void;
}
//# sourceMappingURL=mock-provider.d.ts.map