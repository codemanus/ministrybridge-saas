import { and, eq, inArray } from 'drizzle-orm';
import { db } from '../database.js';
import { roleTypePermissions, userPermissionOverrides } from '../schema/rbac.js';

export type PermissionEffect = 'allow' | 'deny';

export interface UserOverride {
  permissionKey: string;
  effect: PermissionEffect;
}

export async function getRoleTypePermissions(
  organizationId: string,
  roleTypes: string[]
): Promise<Set<string>> {
  if (roleTypes.length === 0) return new Set();

  const rows = await db
    .select({ permissionKey: roleTypePermissions.permissionKey })
    .from(roleTypePermissions)
    .where(
      and(
        eq(roleTypePermissions.organizationId, organizationId),
        inArray(roleTypePermissions.roleType, roleTypes as any)
      )
    );

  return new Set(rows.map((r: { permissionKey: string }) => r.permissionKey));
}

export async function getUserPermissionOverrides(
  organizationId: string,
  userId: string
): Promise<UserOverride[]> {
  const rows = await db
    .select({
      permissionKey: userPermissionOverrides.permissionKey,
      effect: userPermissionOverrides.effect,
    })
    .from(userPermissionOverrides)
    .where(
      and(
        eq(userPermissionOverrides.organizationId, organizationId),
        eq(userPermissionOverrides.userId, userId)
      )
    );

  return rows.map((r: { permissionKey: string; effect: PermissionEffect }) => ({ permissionKey: r.permissionKey, effect: r.effect }));
}


