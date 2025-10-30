import { Module } from '@nestjs/common';
import { FeatureFlagGuard } from './feature-flag.guard.js';
import { EnhancedFeatureFlagGuard } from './enhanced-feature-flag.guard.js';
import { SimpleFeatureFlagGuard } from './simple-feature-flag.guard.js';
import { SessionGuard } from './session.guard.js';

@Module({
  providers: [FeatureFlagGuard, EnhancedFeatureFlagGuard, SimpleFeatureFlagGuard, SessionGuard],
  exports: [FeatureFlagGuard, EnhancedFeatureFlagGuard, SimpleFeatureFlagGuard, SessionGuard],
})
export class GuardsModule {}
