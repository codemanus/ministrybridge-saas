/**
 * Feature context interface for both frontend and backend
 */
export interface FeatureContext {
  tenantId?: string;
  orgId?: string;
  userId?: string;
  roles?: string[];
}

/**
 * Feature flag query interface
 */
export interface FeatureQuery {
  feature: string;
  context: FeatureContext;
}

/**
 * Feature flags result interface
 */
export interface FeatureFlags {
  [feature: string]: boolean;
}

/**
 * Session data interface returned from /session endpoint
 */
export interface SessionData {
  tenantId?: string;
  userId?: string;
  roles?: string[];
  features: FeatureFlags;
}

/**
 * Feature SDK configuration
 */
export interface FeatureSDKConfig {
  apiUrl?: string;
  cacheTTL?: number;
  enableCache?: boolean;
}

/**
 * Feature flag resolution order
 */
export type ResolutionOrder = 'user' | 'org' | 'tenant' | 'default';
