import { Module } from '@nestjs/common';
import { FeaturesController } from './features.controller.js';
import { FeatureFlagsService } from '@packages/flags';

@Module({
  controllers: [FeaturesController],
  providers: [FeatureFlagsService],
  exports: [FeatureFlagsService],
})
export class FeaturesModule {}
