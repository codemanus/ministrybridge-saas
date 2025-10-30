var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
import { FeatureFlagsProvider } from './provider.js';
let FeatureFlagsService = class FeatureFlagsService {
    provider = new FeatureFlagsProvider();
    /**
     * Check if a feature flag is enabled
     */
    async isEnabled(query) {
        return this.provider.isEnabled(query);
    }
    /**
     * Get all feature flags for a context
     */
    async listForContext(ctx) {
        return this.provider.listForContext(ctx);
    }
    /**
     * Clear the cache (useful for testing)
     */
    clearCache() {
        this.provider.clearCache();
    }
};
FeatureFlagsService = __decorate([
    Injectable()
], FeatureFlagsService);
export { FeatureFlagsService };
