import { FeatureSDKClient } from './client.js';
// Global client instance
let globalClient = null;
/**
 * Initialize the global feature SDK client
 */
export function initializeFeatureSDK(config) {
    globalClient = new FeatureSDKClient(config);
}
/**
 * Get the global client instance
 */
export function getFeatureSDKClient() {
    if (!globalClient) {
        throw new Error('Feature SDK not initialized. Call initializeFeatureSDK() first.');
    }
    return globalClient;
}
/**
 * Check if a feature is enabled for the given context
 * This is the main API function as specified in the documentation
 */
export async function isFeatureEnabled(feature, ctx) {
    const client = getFeatureSDKClient();
    return await client.isFeatureEnabled(feature, ctx);
}
/**
 * Get all features for the given context
 * This is the main API function as specified in the documentation
 */
export async function getFeatures(ctx) {
    const client = getFeatureSDKClient();
    return await client.getFeatures(ctx);
}
/**
 * Set session data for the global client
 */
export function setSessionData(sessionData) {
    const client = getFeatureSDKClient();
    client.setSessionData(sessionData);
}
/**
 * Get current session data
 */
export function getSessionData() {
    const client = getFeatureSDKClient();
    return client.getSessionData();
}
/**
 * Clear the feature SDK cache
 */
export function clearFeatureCache() {
    const client = getFeatureSDKClient();
    client.clearCache();
}
