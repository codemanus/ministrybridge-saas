import { FeatureFlagsProvider } from './provider.js';
import { seedFeatureFlags } from './seed.js';

/**
 * Simple test to verify feature flags work
 */
async function testFeatureFlags() {
  try {
    console.log('Testing feature flags...');

    // Seed the database first
    await seedFeatureFlags();

    // Create provider
    const provider = new FeatureFlagsProvider();

    // Test basic feature flag check
    const isBaseEnabled = await provider.isEnabled({
      feature: 'ui-base',
      orgId: 'test-org-1',
    });

    console.log('ui-base enabled:', isBaseEnabled); // Should be true (default)

    const isCampusEnabled = await provider.isEnabled({
      feature: 'ui-campus',
      orgId: 'test-org-1',
    });

    console.log('ui-campus enabled:', isCampusEnabled); // Should be false (default)

    // Test listing all features for a context
    const allFlags = await provider.listForContext({
      orgId: 'test-org-1',
    });

    console.log('All flags for org:', allFlags);

    console.log('✓ Feature flags test completed successfully!');
  } catch (error) {
    console.error('✗ Feature flags test failed:', error);
    throw error;
  }
}

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testFeatureFlags()
    .then(() => {
      console.log('Test completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Test failed:', error);
      process.exit(1);
    });
}
