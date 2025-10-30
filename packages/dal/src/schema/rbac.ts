import { pgEnum, pgTable, text, varchar, timestamp, primaryKey } from 'drizzle-orm/pg-core';

// Role enum mirrors existing role_type in the core schema
export const roleType = pgEnum('role_type', [
  'admin',
  'member',
  'staff',
  'volunteer',
  'fellow',
  'super-user',
  'resident',
]);

// Permissions table (scoped by organization)
export const permissions = pgTable('permissions', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').notNull(),
  key: varchar('key', { length: 255 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Mapping of role_type -> permission_key per organization (composite primary key)
export const roleTypePermissions = pgTable(
  'role_type_permissions',
  {
    organizationId: text('organization_id').notNull(),
    roleType: roleType('role_type').notNull(),
    permissionKey: varchar('permission_key', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.organizationId, table.roleType, table.permissionKey] }),
  })
);

// Per-user overrides for a given permission key within an organization
export const permissionEffect = pgEnum('permission_effect', ['allow', 'deny']);

export const userPermissionOverrides = pgTable(
  'user_permission_overrides',
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
  })
);


