import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { MockFeatureFlagsProvider } from '@packages/flags';

@Controller('features')
export class FeaturesController {
  private featureFlags = new MockFeatureFlagsProvider();

  @Get()
  async getFeatures() {
    // TODO: Get user context from JWT
    const context = {
      orgId: 'test-org-1', // This will come from JWT
      userId: 'test-user-1', // This will come from JWT
    };

    return await this.featureFlags.listForContext(context);
  }

  @Post(':featureId/toggle')
  async toggleFeature(@Param('featureId') featureId: string) {
    // TODO: Add RBAC guard to ensure only org admins can toggle
    
    // For now, just toggle the mock flag
    const currentValue = await this.featureFlags.isEnabled({ feature: featureId });
    this.featureFlags.setMockFlag(featureId, !currentValue);
    
    return {
      message: 'Feature toggled successfully',
      featureId,
      enabled: !currentValue,
    };
  }
}
