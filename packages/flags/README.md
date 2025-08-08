# Feature Flags Package

This package provides a feature flags system for MinistryBridge SaaS, allowing runtime toggling of modules and features based on tenant, organization, and user context.

## Features

- **Hierarchical Resolution**: user → org → tenant → default
- **In-Memory Caching**: 30-second TTL for performance
- **Database Backed**: PostgreSQL with Drizzle ORM
- **NestJS Integration**: Ready-to-use service for API
- **Type Safety**: Full TypeScript support

## Database Schema

### `features` Table
Stores all possible feature flags with default settings.

```sql
CREATE TABLE features (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  active_by_default BOOLEAN DEFAULT FALSE
);
```

### `organization_features` Table
Links organizations to feature flags with custom settings.

```sql
CREATE TABLE organization_features (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  feature_id TEXT NOT NULL REFERENCES features(id),
  enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Usage

### Basic Usage

```typescript
import { FeatureFlagsProvider } from '@packages/flags';

const provider = new FeatureFlagsProvider();

// Check if a feature is enabled
const isEnabled = await provider.isEnabled({
  feature: 'ui-campus',
  orgId: 'org-123',
  userId: 'user-456'
});

// Get all features for a context
const allFlags = await provider.listForContext({
  orgId: 'org-123',
  userId: 'user-456'
});
```

### NestJS Integration

```typescript
import { FeatureFlagsService } from '@packages/flags';

@Injectable()
export class MyService {
  constructor(private featureFlags: FeatureFlagsService) {}

  async someMethod() {
    const isEnabled = await this.featureFlags.isEnabled({
      feature: 'ui-campus',
      orgId: 'org-123'
    });
  }
}
```

## Setup

### 1. Environment Variables

Set your database connection:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/ministrybridge
```

### 2. Database Migration

```bash
# Generate migration
pnpm db:generate

# Push to database
pnpm db:push
```

### 3. Seed Data

```bash
# Seed initial feature flags
pnpm db:seed
```

### 4. Test

```bash
# Run tests
pnpm test
```

## Available Scripts

- `pnpm build` - Build the package
- `pnpm typecheck` - Type checking
- `pnpm test` - Run tests
- `pnpm db:generate` - Generate migrations
- `pnpm db:push` - Push schema to database
- `pnpm db:migrate` - Run migrations
- `pnpm db:studio` - Open Drizzle Studio
- `pnpm db:seed` - Seed initial data

## Feature Flag Keys

The system comes with these predefined feature flags:

- `ui-base` - Core UI functionality (enabled by default)
- `ui-campus` - Campus management features
- `ui-groups` - Groups management features
- `ui-students` - Student management features
- `ui-tech-prod` - Tech & production features

## Caching

The provider includes in-memory caching with a 30-second TTL. Cache keys are generated based on the feature flag query parameters.

To clear the cache manually:

```typescript
provider.clearCache();
```

## Error Handling

The provider is designed to fail safely - if there are any database errors, it will return `false` for feature flags rather than throwing exceptions.
