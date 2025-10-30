export type FlagScope = 'tenant' | 'org' | 'user';
export interface FlagQuery {
    feature: string;
    tenantId?: string;
    orgId?: string;
    userId?: string;
}
export interface FlagsProvider {
    isEnabled(q: FlagQuery): Promise<boolean>;
    listForContext(ctx: {
        tenantId?: string;
        orgId?: string;
        userId?: string;
    }): Promise<Record<string, boolean>>;
}
export declare class FeatureFlagsProvider implements FlagsProvider {
    private cache;
    private cacheTTL;
    private cacheTimestamps;
    /**
     * Check if a feature flag is enabled for the given context
     * Resolution order: user → org → tenant → default=false
     */
    isEnabled(query: FlagQuery): Promise<boolean>;
    /**
     * Get all feature flags for a given context
     */
    listForContext(ctx: {
        tenantId?: string;
        orgId?: string;
        userId?: string;
    }): Promise<Record<string, boolean>>;
    /**
     * Query the database for a specific feature flag
     */
    private queryFeatureFlag;
    /**
     * Generate a cache key for the query
     */
    private getCacheKey;
    /**
     * Clear the cache (useful for testing or manual cache invalidation)
     */
    clearCache(): void;
    /**
     * Get user's organization context from JWT token data
     * This will be used when we integrate with WorkOS authentication
     */
    getUserContext(userId: string): Promise<{
        orgId?: string;
        role?: string;
    } | null>;
}
//# sourceMappingURL=provider.d.ts.map