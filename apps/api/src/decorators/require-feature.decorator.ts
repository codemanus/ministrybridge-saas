import { SetMetadata } from '@nestjs/common';

export const REQUIRE_FEATURE_KEY = 'requireFeature';

/**
 * Decorator to require a specific feature flag for a controller or method
 * Usage: @RequireFeature('ui-campus')
 */
export const RequireFeature = (feature: string) => SetMetadata(REQUIRE_FEATURE_KEY, feature);

/**
 * Decorator to require admin role for feature management
 * Usage: @RequireAdmin()
 */
export const RequireAdmin = () => SetMetadata('requireAdmin', true);
