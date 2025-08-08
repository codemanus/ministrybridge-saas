import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { FeaturesModule } from './features/features.module.js';

@Module({
  imports: [HealthModule, FeaturesModule],
})
export class AppModule {}
