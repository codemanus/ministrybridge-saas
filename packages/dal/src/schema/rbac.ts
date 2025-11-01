import { pgEnum, pgTable, text, varchar, timestamp, primaryKey, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

// NOTE: The `role_type` enum already exists in the core schema (Supabase).
// To avoid migration conflicts, we reference it as `text('role_type')` instead of re-declaring a pgEnum here.

// Permissions table (scoped by organization)
export const permissions = pgTable(
  'rbac_permissions',
  {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    organizationId: text('organization_id').notNull(),
    key: varchar('key', { length: 255 }).notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    // Ensure unique permission keys per organization
    orgKeyUnique: uniqueIndex('rbac_permissions_org_key_uq').on(table.organizationId, table.key),
    // Common filter path for multi-tenant queries
    orgIdx: index('rbac_permissions_org_idx').on(table.organizationId),
  })
);

// Mapping of role_type -> permission_key per organization (composite primary key)
export const roleTypePermissions = pgTable(
  'rbac_role_type_permissions',
  {
    organizationId: text('organization_id').notNull(),
    // Reference existing enum type by column name without re-declaring an enum
    roleType: text('role_type').notNull(),
    permissionKey: varchar('permission_key', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.organizationId, table.roleType, table.permissionKey] }),
    orgRoleIdx: index('rbac_rtp_org_role_idx').on(table.organizationId, table.roleType),
    orgPermIdx: index('rbac_rtp_org_perm_idx').on(table.organizationId, table.permissionKey),
  })
);

// Per-user overrides for a given permission key within an organization
// Namespaced to avoid collisions with any existing enums
export const permissionEffect = pgEnum('rbac_permission_effect', ['allow', 'deny']);

export const userPermissionOverrides = pgTable(
  'rbac_user_permission_overrides',
  {
    organizationId: text('organization_id').notNull(),
    userId: text('user_id').notNull(),
    permissionKey: varchar('permission_key', { length: 255 }).notNull(),
    effect: permissionEffect('effect').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.organizationId, table.userId, table.permissionKey] }),
    orgUserIdx: index('rbac_upo_org_user_idx').on(table.organizationId, table.userId),
    orgPermIdx: index('rbac_upo_org_perm_idx').on(table.organizationId, table.permissionKey),
  })
);


