/**
 * Client-side feature SDK for frontend applications
 */
export class FeatureSDKClient {
    cache = new Map();
    cacheTTL = 30 * 1000; // 30 seconds
    cacheTimestamps = new Map();
    sessionData = null;
    apiUrl;
    constructor(config = {}) {
        this.apiUrl = config.apiUrl || '/api';
    }
    /**
     * Initialize the SDK with session data
     */
    setSessionData(sessionData) {
        this.sessionData = sessionData;
        this.clearCache(); // Clear cache when session changes
    }
    /**
     * Get session data
     */
    getSessionData() {
        return this.sessionData;
    }
    /**
     * Check if a feature is enabled for the current context
     */
    async isFeatureEnabled(feature, context) {
        const cacheKey = this.getCacheKey(feature, context);
        const now = Date.now();
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const timestamp = this.cacheTimestamps.get(cacheKey);
            if (timestamp && (now - timestamp) < this.cacheTTL) {
                return this.cache.get(cacheKey);
            }
        }
        // Use session data if available
        if (this.sessionData?.features && this.sessionData.features.hasOwnProperty(feature)) {
            const result = this.sessionData.features[feature];
            this.cache.set(cacheKey, result);
            this.cacheTimestamps.set(cacheKey, now);
            return result;
        }
        // Fallback to API call
        try {
            const result = await this.queryFeatureFlag(feature, context);
            this.cache.set(cacheKey, result);
            this.cacheTimestamps.set(cacheKey, now);
            return result;
        }
        catch (error) {
            console.error('Error checking feature flag:', error);
            return false; // Fail safe
        }
    }
    /**
     * Get all features for the current context
     */
    async getFeatures(context) {
        // Use session data if available
        if (this.sessionData?.features) {
            return { ...this.sessionData.features };
        }
        // Fallback to API call
        try {
            const response = await fetch(`${this.apiUrl}/features`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include cookies for session
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const features = await response.json();
            return features;
        }
        catch (error) {
            console.error('Error fetching features:', error);
            return {}; // Return empty object on error
        }
    }
    /**
     * Query a specific feature flag from the API
     */
    async queryFeatureFlag(feature, context) {
        try {
            const response = await fetch(`${this.apiUrl}/features/${feature}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const result = await response.json();
            return result.enabled || false;
        }
        catch (error) {
            console.error('Error querying feature flag:', error);
            return false;
        }
    }
    /**
     * Generate cache key for feature and context
     */
    getCacheKey(feature, context) {
        const ctx = context || {};
        return `${feature}:${ctx.tenantId || 'no-tenant'}:${ctx.orgId || 'no-org'}:${ctx.userId || 'no-user'}`;
    }
    /**
     * Clear the cache
     */
    clearCache() {
        this.cache.clear();
        this.cacheTimestamps.clear();
    }
    /**
     * Get current context from session data
     */
    getCurrentContext() {
        if (!this.sessionData) {
            return {};
        }
        return {
            tenantId: this.sessionData.tenantId,
            orgId: this.sessionData.tenantId, // Assuming tenantId = orgId for now
            userId: this.sessionData.userId,
            roles: this.sessionData.roles,
        };
    }
}
