import { useState, useEffect, useCallback } from 'react';
import type { FeatureContext, FeatureFlags } from './types.js';
import { isFeatureEnabled, getFeatures, getSessionData } from './api.js';

/**
 * Hook to check if a feature is enabled
 */
export function useFeatureFlag(feature: string, context?: Partial<FeatureContext>): boolean {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    const checkFeature = async () => {
      try {
        setLoading(true);
        const result = await isFeatureEnabled(feature, context || {});
        if (mounted) {
          setEnabled(result);
        }
      } catch (error) {
        console.error('Error checking feature flag:', error);
        if (mounted) {
          setEnabled(false);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkFeature();

    return () => {
      mounted = false;
    };
  }, [feature, context]);

  return enabled;
}

/**
 * Hook to get all features for the current context
 */
export function useFeatures(context?: Partial<FeatureContext>): FeatureFlags {
  const [features, setFeatures] = useState<FeatureFlags>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    const fetchFeatures = async () => {
      try {
        setLoading(true);
        const result = await getFeatures(context || {});
        if (mounted) {
          setFeatures(result);
        }
      } catch (error) {
        console.error('Error fetching features:', error);
        if (mounted) {
          setFeatures({});
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchFeatures();

    return () => {
      mounted = false;
    };
  }, [context]);

  return features;
}

/**
 * Hook to get the current feature context
 */
export function useFeatureContext(): FeatureContext {
  const sessionData = getSessionData();
  
  return {
    tenantId: sessionData?.tenantId,
    orgId: sessionData?.tenantId, // Assuming tenantId = orgId
    userId: sessionData?.userId,
    roles: sessionData?.roles,
  };
}

/**
 * Hook to check if a feature is enabled with loading state
 */
export function useFeatureFlagWithLoading(feature: string, context?: Partial<FeatureContext>): { enabled: boolean; loading: boolean } {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    const checkFeature = async () => {
      try {
        setLoading(true);
        const result = await isFeatureEnabled(feature, context || {});
        if (mounted) {
          setEnabled(result);
        }
      } catch (error) {
        console.error('Error checking feature flag:', error);
        if (mounted) {
          setEnabled(false);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkFeature();

    return () => {
      mounted = false;
    };
  }, [feature, context]);

  return { enabled, loading };
}

/**
 * Hook to refresh feature flags
 */
export function useRefreshFeatures() {
  const refresh = useCallback(async (context?: Partial<FeatureContext>) => {
    try {
      const features = await getFeatures(context || {});
      return features;
    } catch (error) {
      console.error('Error refreshing features:', error);
      return {};
    }
  }, []);

  return refresh;
}
