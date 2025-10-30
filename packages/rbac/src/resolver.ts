import { and, eq } from 'drizzle-orm';
import { FeatureFlagsProvider } from '@packages/flags/src/index.js';
import { organizationMemberships } from '@packages/flags/src/schema.js';
import { db as flagsDb } from '@packages/flags/src/database.js';
import {
  getRoleTypePermissions,
  getUserPermissionOverrides,
} from '@packages/dal/src/repositories/rbac.repository.js';

export interface RbacContext {
  tenantId: string; // organization_id
  userId: string;
}

export type PermissionKey = string;

const flags = new FeatureFlagsProvider();

async function getUserRoleTypes(organizationId: string, userId: string): Promise<string[]> {
  const rows = await flagsDb
    .select({ roleType: organizationMemberships.roleType })
    .from(organizationMemberships)
    .where(
      and(
        eq(organizationMemberships.organizationId, organizationId),
        eq(organizationMemberships.userId, userId)
      )
    );
  return rows.map((r) => r.roleType);
}

export async function canAccess(ctx: RbacContext, permission: PermissionKey): Promise<boolean> {
  const { tenantId: organizationId, userId } = ctx;

  // 1) explicit user deny
  const overrides = await getUserPermissionOverrides(organizationId, userId);
  if (overrides.some((o) => o.permissionKey === permission && o.effect === 'deny')) {
    return false;
  }

  // 2) flag disabled => deny
  const isEnabled = await flags.isEnabled({ feature: permission, orgId: organizationId, userId });
  if (!isEnabled) return false;

  // 3) explicit user allow
  if (overrides.some((o) => o.permissionKey === permission && o.effect === 'allow')) {
    return true;
  }

  // 4) role union allows
  const roleTypes = await getUserRoleTypes(organizationId, userId);
  if (roleTypes.length > 0) {
    const rolePerms = await getRoleTypePermissions(organizationId, roleTypes);
    if (rolePerms.has(permission)) return true;
  }

  // 5) default deny
  return false;
}

export async function getEffectivePermissions(ctx: RbacContext): Promise<Set<PermissionKey>> {
  const { tenantId: organizationId, userId } = ctx;

  const effective = new Set<PermissionKey>();

  const [overrides, roleTypes] = await Promise.all([
    getUserPermissionOverrides(organizationId, userId),
    getUserRoleTypes(organizationId, userId),
  ]);

  const rolePerms = roleTypes.length > 0 ? await getRoleTypePermissions(organizationId, roleTypes) : new Set<PermissionKey>();

  // Apply user allows first (subject to flags later)
  for (const o of overrides) {
    if (o.effect === 'allow') {
      effective.add(o.permissionKey);
    }
  }

  // Add role-based permissions
  for (const key of rolePerms) {
    effective.add(key);
  }

  // Remove any explicit denies
  for (const o of overrides) {
    if (o.effect === 'deny') {
      effective.delete(o.permissionKey);
    }
  }

  // Remove any keys disabled by flags
  const checks = await Promise.all(
    Array.from(effective).map(async (key) => ({
      key,
      enabled: await flags.isEnabled({ feature: key, orgId: organizationId, userId }),
    }))
  );
  for (const c of checks) {
    if (!c.enabled) effective.delete(c.key);
  }

  return effective;
}


