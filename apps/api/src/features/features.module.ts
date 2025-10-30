import { Module } from '@nestjs/common';
import { FeaturesController } from './features.controller.js';
import { TestProtectedController } from './test-protected.controller.js';
import { FeatureFlagsService } from '@packages/flags';

@Module({
  controllers: [FeaturesController, TestProtectedController],
  providers: [FeatureFlagsService],
  exports: [FeatureFlagsService],
})
export class FeaturesModule {}
