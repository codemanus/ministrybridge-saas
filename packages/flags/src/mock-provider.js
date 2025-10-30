/**
 * Mock feature flags provider for testing without database
 */
export class MockFeatureFlagsProvider {
    mockFlags = {
        'ui-base': true,
        'ui-campus': false,
        'ui-groups': false,
        'ui-students': false,
        'ui-tech-prod': false,
    };
    async isEnabled(query) {
        // Simple mock implementation
        return this.mockFlags[query.feature] ?? false;
    }
    async listForContext(ctx) {
        return { ...this.mockFlags };
    }
    /**
     * Set a mock flag value for testing
     */
    setMockFlag(feature, enabled) {
        this.mockFlags[feature] = enabled;
    }
    /**
     * Reset all flags to defaults
     */
    resetToDefaults() {
        this.mockFlags = {
            'ui-base': true,
            'ui-campus': false,
            'ui-groups': false,
            'ui-students': false,
            'ui-tech-prod': false,
        };
    }
}
