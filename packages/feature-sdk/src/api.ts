import type { FeatureContext, FeatureFlags } from './types.js';
import { FeatureSDKClient } from './client.js';

// Global client instance
let globalClient: FeatureSDKClient | null = null;

/**
 * Initialize the global feature SDK client
 */
export function initializeFeatureSDK(config?: { apiUrl?: string; cacheTTL?: number; enableCache?: boolean }): void {
  globalClient = new FeatureSDKClient(config);
}

/**
 * Get the global client instance
 */
export function getFeatureSDKClient(): FeatureSDKClient {
  if (!globalClient) {
    throw new Error('Feature SDK not initialized. Call initializeFeatureSDK() first.');
  }
  return globalClient;
}

/**
 * Check if a feature is enabled for the given context
 * This is the main API function as specified in the documentation
 */
export async function isFeatureEnabled(feature: string, ctx: FeatureContext): Promise<boolean> {
  const client = getFeatureSDKClient();
  return await client.isFeatureEnabled(feature, ctx);
}

/**
 * Get all features for the given context
 * This is the main API function as specified in the documentation
 */
export async function getFeatures(ctx: FeatureContext): Promise<Record<string, boolean>> {
  const client = getFeatureSDKClient();
  return await client.getFeatures(ctx);
}

/**
 * Set session data for the global client
 */
export function setSessionData(sessionData: { tenantId?: string; userId?: string; roles?: string[]; features: Record<string, boolean> }): void {
  const client = getFeatureSDKClient();
  client.setSessionData(sessionData);
}

/**
 * Get current session data
 */
export function getSessionData(): { tenantId?: string; userId?: string; roles?: string[]; features: Record<string, boolean> } | null {
  const client = getFeatureSDKClient();
  return client.getSessionData();
}

/**
 * Clear the feature SDK cache
 */
export function clearFeatureCache(): void {
  const client = getFeatureSDKClient();
  client.clearCache();
}
