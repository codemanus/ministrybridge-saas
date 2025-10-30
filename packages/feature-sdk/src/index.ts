// Core API functions as specified in documentation
export { 
  isFeatureEnabled, 
  getFeatures, 
  initializeFeatureSDK, 
  setSessionData,
  getSessionData,
  clearFeatureCache,
  getFeatureSDKClient
} from './api.js';

// Client and Server SDKs
export { FeatureSDKClient } from './client.js';
export { FeatureSDKServer } from './server.js';

// React Hooks
export {
  useFeatureFlag,
  useFeatures,
  useFeatureContext,
  useFeatureFlagWithLoading,
  useRefreshFeatures,
} from './hooks.js';

// Types
export type {
  FeatureContext,
  FeatureFlags,
  SessionData,
  FeatureSDKConfig,
  FeatureQuery,
  ResolutionOrder,
} from './types.js';

// Default export for convenience
export { FeatureSDKClient as default } from './client.js';
