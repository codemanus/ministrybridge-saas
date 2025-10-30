import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { FeaturesModule } from './features/features.module.js';
import { SessionModule } from './session/session.module.js';
import { GuardsModule } from './guards/guards.module.js';
import { AuthModule } from './auth/auth.module.js';
import { AppConfigModule } from './config/config.module.js';
import { RbacModule } from './rbac/rbac.module.js';

@Module({
  imports: [AppConfigModule, HealthModule, FeaturesModule, SessionModule, GuardsModule, AuthModule, RbacModule],
})
export class AppModule {}
