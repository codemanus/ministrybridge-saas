// Export the main provider and types
export { FeatureFlagsProvider } from './provider.js';
export type { FlagQuery, FlagsProvider, FlagScope } from './provider.js';

// Export mock provider for testing
export { MockFeatureFlagsProvider } from './mock-provider.js';

// Export NestJS service
export { FeatureFlagsService } from './nestjs-provider.js';

// Export database connection
export { db, client } from './database.js';

// Export schema for migrations
export * from './schema.js';

// Default export for convenience
export { FeatureFlagsProvider as default } from './provider.js';
