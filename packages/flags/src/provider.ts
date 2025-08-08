import { eq, and } from 'drizzle-orm';
import { db } from './database.js';
import { features, organizationFeatures, organizations, users, organizationMemberships } from './schema.js';

export type FlagScope = 'tenant' | 'org' | 'user';

export interface FlagQuery {
  feature: string;
  tenantId?: string;
  orgId?: string;
  userId?: string;
}

export interface FlagsProvider {
  isEnabled(q: FlagQuery): Promise<boolean>;
  listForContext(ctx: {tenantId?: string; orgId?: string; userId?: string;}): Promise<Record<string, boolean>>;
}

export class FeatureFlagsProvider implements FlagsProvider {
  private cache = new Map<string, boolean>();
  private cacheTTL = 30 * 1000; // 30 seconds
  private cacheTimestamps = new Map<string, number>();

  /**
   * Check if a feature flag is enabled for the given context
   * Resolution order: user → org → tenant → default=false
   */
  async isEnabled(query: FlagQuery): Promise<boolean> {
    const cacheKey = this.getCacheKey(query);
    const now = Date.now();
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const timestamp = this.cacheTimestamps.get(cacheKey);
      if (timestamp && (now - timestamp) < this.cacheTTL) {
        return this.cache.get(cacheKey)!;
      }
    }

    // Query database for the feature flag
    const result = await this.queryFeatureFlag(query);
    
    // Cache the result
    this.cache.set(cacheKey, result);
    this.cacheTimestamps.set(cacheKey, now);
    
    return result;
  }

  /**
   * Get all feature flags for a given context
   */
  async listForContext(ctx: {tenantId?: string; orgId?: string; userId?: string;}): Promise<Record<string, boolean>> {
    // Get all features
    const allFeatures = await db.select().from(features);
    
    // Check each feature's status
    const results: Record<string, boolean> = {};
    
    for (const feature of allFeatures) {
      const query: FlagQuery = {
        feature: feature.key,
        tenantId: ctx.tenantId,
        orgId: ctx.orgId,
        userId: ctx.userId,
      };
      
      results[feature.key] = await this.isEnabled(query);
    }
    
    return results;
  }

  /**
   * Query the database for a specific feature flag
   */
  private async queryFeatureFlag(query: FlagQuery): Promise<boolean> {
    try {
      // First, get the feature record
      const feature = await db
        .select()
        .from(features)
        .where(eq(features.key, query.feature))
        .limit(1);

      if (feature.length === 0) {
        return false; // Feature doesn't exist
      }

      const featureRecord = feature[0];

      // If we have an orgId, check organization-specific setting
      if (query.orgId) {
        const orgFeature = await db
          .select()
          .from(organizationFeatures)
          .where(
            and(
              eq(organizationFeatures.organizationId, query.orgId),
              eq(organizationFeatures.featureId, featureRecord.id)
            )
          )
          .limit(1);

        if (orgFeature.length > 0) {
          return orgFeature[0].enabled;
        }
      }

      // Fall back to default setting
      return featureRecord.activeByDefault;
    } catch (error) {
      console.error('Error querying feature flag:', error);
      return false; // Fail safe
    }
  }

  /**
   * Generate a cache key for the query
   */
  private getCacheKey(query: FlagQuery): string {
    return `${query.feature}:${query.tenantId || 'no-tenant'}:${query.orgId || 'no-org'}:${query.userId || 'no-user'}`;
  }

  /**
   * Clear the cache (useful for testing or manual cache invalidation)
   */
  clearCache(): void {
    this.cache.clear();
    this.cacheTimestamps.clear();
  }

  /**
   * Get user's organization context from JWT token data
   * This will be used when we integrate with WorkOS authentication
   */
  async getUserContext(userId: string): Promise<{orgId?: string; role?: string} | null> {
    try {
      const membership = await db
        .select({
          organizationId: organizationMemberships.organizationId,
          roleType: organizationMemberships.roleType,
        })
        .from(organizationMemberships)
        .where(eq(organizationMemberships.userId, userId))
        .limit(1);

      if (membership.length > 0) {
        return {
          orgId: membership[0].organizationId,
          role: membership[0].roleType,
        };
      }

      return null;
    } catch (error) {
      console.error('Error getting user context:', error);
      return null;
    }
  }
}
