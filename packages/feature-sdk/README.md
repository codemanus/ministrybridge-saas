# Feature SDK

A unified feature flag SDK for both frontend and backend applications in the MinistryBridge SaaS platform.

## Features

- **Unified API**: Same interface for frontend and backend
- **React Hooks**: Easy integration with React applications
- **Caching**: In-memory caching with configurable TTL
- **Session Management**: Automatic session data integration
- **Type Safety**: Full TypeScript support
- **Error Handling**: Fail-safe defaults and error recovery

## Installation

The package is available as a workspace dependency:

```bash
pnpm add @packages/feature-sdk
```

## Quick Start

### Frontend Usage

```typescript
import { initializeFeatureSDK, isFeatureEnabled, getFeatures } from '@packages/feature-sdk';

// Initialize the SDK
initializeFeatureSDK({
  apiUrl: '/api',
  cacheTTL: 30000, // 30 seconds
});

// Check if a feature is enabled
const isCampusEnabled = await isFeatureEnabled('ui-campus', {
  tenantId: 'org-123',
  userId: 'user-456',
});

// Get all features for a context
const features = await getFeatures({
  tenantId: 'org-123',
  userId: 'user-456',
});
```

### React Hooks

```typescript
import { useFeatureFlag, useFeatures } from '@packages/feature-sdk';

function MyComponent() {
  // Check if a feature is enabled
  const isCampusEnabled = useFeatureFlag('ui-campus');
  
  // Get all features
  const features = useFeatures();
  
  return (
    <div>
      {isCampusEnabled && <CampusModule />}
      {features['ui-groups'] && <GroupsModule />}
    </div>
  );
}
```

### Backend Usage

```typescript
import { FeatureSDKServer } from '@packages/feature-sdk';

const sdk = new FeatureSDKServer();

// Check if a feature is enabled
const isEnabled = await sdk.isFeatureEnabled('ui-campus', {
  tenantId: 'org-123',
  userId: 'user-456',
});

// Get all features for a context
const features = await sdk.getFeatures({
  tenantId: 'org-123',
  userId: 'user-456',
});
```

## API Reference

### Core Functions

#### `isFeatureEnabled(feature: string, ctx: FeatureContext): Promise<boolean>`

Check if a feature is enabled for the given context.

```typescript
const enabled = await isFeatureEnabled('ui-campus', {
  tenantId: 'org-123',
  userId: 'user-456',
});
```

#### `getFeatures(ctx: FeatureContext): Promise<Record<string, boolean>>`

Get all features for the given context.

```typescript
const features = await getFeatures({
  tenantId: 'org-123',
  userId: 'user-456',
});
```

### React Hooks

#### `useFeatureFlag(feature: string, context?: Partial<FeatureContext>): boolean`

Hook to check if a feature is enabled.

```typescript
const isEnabled = useFeatureFlag('ui-campus');
```

#### `useFeatures(context?: Partial<FeatureContext>): FeatureFlags`

Hook to get all features for the current context.

```typescript
const features = useFeatures();
```

#### `useFeatureContext(): FeatureContext`

Hook to get the current feature context from session data.

```typescript
const context = useFeatureContext();
```

#### `useFeatureFlagWithLoading(feature: string, context?: Partial<FeatureContext>): { enabled: boolean; loading: boolean }`

Hook to check if a feature is enabled with loading state.

```typescript
const { enabled, loading } = useFeatureFlagWithLoading('ui-campus');
```

### Classes

#### `FeatureSDKClient`

Client-side SDK for frontend applications.

```typescript
import { FeatureSDKClient } from '@packages/feature-sdk';

const client = new FeatureSDKClient({
  apiUrl: '/api',
  cacheTTL: 30000,
});

// Set session data
client.setSessionData({
  tenantId: 'org-123',
  userId: 'user-456',
  features: { 'ui-campus': true },
});

// Check feature
const enabled = await client.isFeatureEnabled('ui-campus');
```

#### `FeatureSDKServer`

Server-side SDK for backend applications.

```typescript
import { FeatureSDKServer } from '@packages/feature-sdk';

const sdk = new FeatureSDKServer();

const enabled = await sdk.isFeatureEnabled('ui-campus', {
  tenantId: 'org-123',
  userId: 'user-456',
});
```

## Types

### `FeatureContext`

```typescript
interface FeatureContext {
  tenantId?: string;
  orgId?: string;
  userId?: string;
  roles?: string[];
}
```

### `FeatureFlags`

```typescript
interface FeatureFlags {
  [feature: string]: boolean;
}
```

### `SessionData`

```typescript
interface SessionData {
  tenantId?: string;
  userId?: string;
  roles?: string[];
  features: FeatureFlags;
}
```

## Configuration

### Frontend Configuration

```typescript
initializeFeatureSDK({
  apiUrl: '/api',           // API base URL
  cacheTTL: 30000,          // Cache TTL in milliseconds
  enableCache: true,         // Enable/disable caching
});
```

### Backend Configuration

```typescript
import { FeatureFlagsProvider } from '@packages/flags';

const provider = new FeatureFlagsProvider();
const sdk = new FeatureSDKServer(provider);
```

## Session Management

The SDK automatically integrates with session data from the `/session` endpoint:

```typescript
// Set session data (usually done during app bootstrap)
setSessionData({
  tenantId: 'org-123',
  userId: 'user-456',
  roles: ['admin'],
  features: {
    'ui-base': true,
    'ui-campus': false,
    'ui-groups': true,
  },
});

// The SDK will use this data for feature checks
const enabled = await isFeatureEnabled('ui-campus');
```

## Error Handling

The SDK is designed to fail safely:

- **Network errors**: Return `false` for feature flags
- **Unknown features**: Return `false` instead of throwing
- **Cache errors**: Fall back to API calls
- **Session errors**: Use empty context

## Caching

The SDK includes intelligent caching:

- **In-memory cache**: 30-second TTL by default
- **Session-based**: Uses session data when available
- **Configurable**: TTL can be customized
- **Automatic invalidation**: Cache clears on session changes

## Integration with Shell App

The SDK is designed to work seamlessly with the shell app:

1. **Bootstrap**: Initialize SDK during app startup
2. **Session**: Set session data from `/session` endpoint
3. **Conditional Loading**: Use feature flags to load remotes
4. **Navigation**: Show/hide nav items based on features

## Migration from Mock Provider

The SDK works with both mock and real providers:

1. **Development**: Uses mock provider automatically
2. **Production**: Replace with real provider
3. **No code changes**: Same API interface

## Examples

### Shell App Bootstrap

```typescript
// In shell app bootstrap
import { initializeFeatureSDK, setSessionData } from '@packages/feature-sdk';

// Initialize SDK
initializeFeatureSDK({ apiUrl: '/api' });

// Fetch session data
const response = await fetch('/api/session');
const sessionData = await response.json();

// Set session data
setSessionData(sessionData);

// Now feature flags are available throughout the app
```

### Conditional Remote Loading

```typescript
import { useFeatureFlag } from '@packages/feature-sdk';

function App() {
  const campusEnabled = useFeatureFlag('ui-campus');
  const groupsEnabled = useFeatureFlag('ui-groups');

  return (
    <div>
      {campusEnabled && <CampusRemote />}
      {groupsEnabled && <GroupsRemote />}
    </div>
  );
}
```

### Backend Guard

```typescript
import { FeatureSDKServer } from '@packages/feature-sdk';

@Injectable()
export class FeatureFlagGuard implements CanActivate {
  private sdk = new FeatureSDKServer();

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const feature = request.route.path; // Extract feature from route

    const userContext = {
      tenantId: request.user?.tenantId,
      userId: request.user?.userId,
    };

    return await this.sdk.isFeatureEnabled(feature, userContext);
  }
}
```
