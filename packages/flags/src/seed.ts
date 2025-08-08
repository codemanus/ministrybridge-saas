import { db } from './database.js';
import { features, organizationFeatures, organizations, users, organizationMemberships } from './schema.js';
import { eq } from 'drizzle-orm';

/**
 * Seed the database with initial feature flags
 */
export async function seedFeatureFlags() {
  try {
    console.log('Seeding feature flags...');

    // Insert base features
    const baseFeatures = [
      {
        key: 'ui-base',
        name: 'Base UI Module',
        description: 'Core UI functionality and navigation',
        activeByDefault: true,
      },
      {
        key: 'ui-campus',
        name: 'Campus Management',
        description: 'Campus and location management features',
        activeByDefault: false,
      },
      {
        key: 'ui-groups',
        name: 'Groups Management',
        description: 'Small groups and ministry team features',
        activeByDefault: false,
      },
      {
        key: 'ui-students',
        name: 'Student Management',
        description: 'Student registration and tracking features',
        activeByDefault: false,
      },
      {
        key: 'ui-tech-prod',
        name: 'Tech & Production',
        description: 'Technical and production management features',
        activeByDefault: false,
      },
    ];

    for (const feature of baseFeatures) {
      await db.insert(features).values(feature).onConflictDoNothing();
      console.log(`✓ Added feature: ${feature.name}`);
    }

    console.log('Feature flags seeded successfully!');
  } catch (error) {
    console.error('Error seeding feature flags:', error);
    throw error;
  }
}

/**
 * Enable a feature for a specific organization
 */
export async function enableFeatureForOrg(orgId: string, featureKey: string) {
  try {
    // Verify organization exists
    const org = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, orgId))
      .limit(1);

    if (org.length === 0) {
      throw new Error(`Organization ${orgId} not found`);
    }

    // Get the feature
    const feature = await db
      .select()
      .from(features)
      .where(eq(features.key, featureKey))
      .limit(1);

    if (feature.length === 0) {
      throw new Error(`Feature ${featureKey} not found`);
    }

    // Enable for organization
    await db
      .insert(organizationFeatures)
      .values({
        organizationId: orgId,
        featureId: feature[0].id,
        enabled: true,
      })
      .onConflictDoNothing();

    console.log(`✓ Enabled ${featureKey} for organization ${orgId}`);
  } catch (error) {
    console.error('Error enabling feature for organization:', error);
    throw error;
  }
}

/**
 * Create a test organization for development
 */
export async function createTestOrganization() {
  try {
    const testOrg = await db
      .insert(organizations)
      .values({
        workosId: 'test-org-workos-id',
        name: 'Test Organization',
        domains: ['test.com'],
        allowedEmailDomains: ['test.com'],
      })
      .returning();

    console.log(`✓ Created test organization: ${testOrg[0].id}`);
    return testOrg[0].id;
  } catch (error) {
    console.error('Error creating test organization:', error);
    throw error;
  }
}

/**
 * Create a test user for development
 */
export async function createTestUser() {
  try {
    const testUser = await db
      .insert(users)
      .values({
        workosId: 'test-user-workos-id',
        email: 'test@test.com',
        firstName: 'Test',
        lastName: 'User',
      })
      .returning();

    console.log(`✓ Created test user: ${testUser[0].id}`);
    return testUser[0].id;
  } catch (error) {
    console.error('Error creating test user:', error);
    throw error;
  }
}

/**
 * Create a test organization membership
 */
export async function createTestMembership(userId: string, organizationId: string) {
  try {
    const membership = await db
      .insert(organizationMemberships)
      .values({
        workosId: 'test-membership-workos-id',
        userId,
        organizationId,
        roleType: 'admin',
      })
      .returning();

    console.log(`✓ Created test membership: ${membership[0].id}`);
    return membership[0].id;
  } catch (error) {
    console.error('Error creating test membership:', error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedFeatureFlags()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}
