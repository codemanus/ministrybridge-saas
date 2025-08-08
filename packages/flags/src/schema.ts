import { pgTable, text, boolean, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";


// Role Enum: Defines possible roles for organization members
// DO NOT CHANGE THE ORDER OF THESE ROLES
// INFO: THIS IS USED FOR RBAC AND WILL BREAK IF THE ORDER IS CHANGED
export const roleType = pgEnum("role_type", [
    "admin",
    "member",
    "staff",
    "volunteer",
    "fellow",
    "super-user",
    "resident",
  ]);

// Users Table: Stores core user information synced with WorkOS
// This is a reference table for the users table in the auth service
// It is used to store user information that is synced with WorkOS
// DO NOT CHANGE THE FIELDS OF THIS TABLE
// THIS IS USED FOR RBAC AND WILL BREAK IF THE FIELDS ARE CHANGED
// INFO: CURRENT TABLE IS PURELY FOR REFERENCE OF PROD SETUP
export const users = pgTable("users", {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    workosId: varchar("workos_id", { length: 255 }).unique().notNull(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    firstName: varchar("first_name", { length: 100 }),
    lastName: varchar("last_name", { length: 100 }),
    emailVerified: boolean("email_verified").default(false),
    profilePictureUrl: text("profile_picture_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    lastLogin: timestamp("last_login"),
    active: boolean("active").default(true),
    deleted: boolean("deleted").default(false),
  });
// NEW TABLE: Features Table
export const features = pgTable("features", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  key: text("key").unique().notNull(), // e.g. 'ui-campus', 'ui-groups'
  name: text("name").notNull(),        // Human readable
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  activeByDefault: boolean("active_by_default").default(false).notNull(),
});

// NEW TABLE: Organization Features Table
export const organizationFeatures = pgTable("organization_features", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organizations.id),
  featureId: text("feature_id")
    .notNull()
    .references(() => features.id),
  enabled: boolean("enabled").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Import the existing organizations table (we'll need to create this reference)
// For now, we'll define a placeholder that will be updated when we have the actual schema
// Organizations Table: Represents companies/teams using the platform
export const organizations = pgTable("organizations", {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    workosId: varchar("workos_id", { length: 255 }).unique().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    domains: text("domains").array(),
    allowedEmailDomains: text("allowed_email_domains").array(),
    active: boolean("active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  });
  

// Organization Memberships Table: Junction table for user-organization relationships
export const organizationMemberships = pgTable("organization_memberships", {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    workosId: varchar("workos_id", { length: 255 }).unique().notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id),
    roleType: roleType("role_type").default("member").notNull(),
    status: varchar("status", { length: 50 }).notNull().default("active"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  });

// Relations
// INFO: This relation already exists in the PROD DB
// DO NOT CHANGE THESE RELATIONS
// THIS IS USED FOR RBAC AND WILL BREAK IF THE RELATIONS ARE CHANGED
export const organizationMembershipRelations = relations(
    organizationMemberships,
    ({ one }) => ({
      user: one(users, {
        fields: [organizationMemberships.userId],
        references: [users.id],
      }),
      organization: one(organizations, {
        fields: [organizationMemberships.organizationId],
        references: [organizations.id],
      }),
    })
  );

// Feature Flags Relations
export const organizationFeaturesRelations = relations(
    organizationFeatures,
    ({ one }) => ({
      organization: one(organizations, {
        fields: [organizationFeatures.organizationId],
        references: [organizations.id],
      }),
      feature: one(features, {
        fields: [organizationFeatures.featureId],
        references: [features.id],
      }),
    })
  );

export const featuresRelations = relations(
    features,
    ({ many }) => ({
      organizationFeatures: many(organizationFeatures),
    })
  );

export const organizationsRelations = relations(
    organizations,
    ({ many }) => ({
      organizationFeatures: many(organizationFeatures),
      organizationMemberships: many(organizationMemberships),
    })
  );


// Update the reference after we have the actual organizations table
// organizationFeatures.organizationId.references(() => organizations.id)

