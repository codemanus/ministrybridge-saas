import { type FlagQuery } from './provider.js';
export declare class FeatureFlagsService {
    private provider;
    /**
     * Check if a feature flag is enabled
     */
    isEnabled(query: FlagQuery): Promise<boolean>;
    /**
     * Get all feature flags for a context
     */
    listForContext(ctx: {
        tenantId?: string;
        orgId?: string;
        userId?: string;
    }): Promise<Record<string, boolean>>;
    /**
     * Clear the cache (useful for testing)
     */
    clearCache(): void;
}
//# sourceMappingURL=nestjs-provider.d.ts.map