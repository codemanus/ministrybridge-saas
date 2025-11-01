CREATE TYPE "public"."rbac_permission_effect" AS ENUM('allow', 'deny');--> statement-breakpoint
CREATE TABLE "rbac_permissions" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"key" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rbac_role_type_permissions" (
	"organization_id" text NOT NULL,
	"role_type" text NOT NULL,
	"permission_key" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "rbac_role_type_permissions_organization_id_role_type_permission_key_pk" PRIMARY KEY("organization_id","role_type","permission_key")
);
--> statement-breakpoint
CREATE TABLE "rbac_user_permission_overrides" (
	"organization_id" text NOT NULL,
	"user_id" text NOT NULL,
	"permission_key" varchar(255) NOT NULL,
	"effect" "rbac_permission_effect" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "rbac_user_permission_overrides_organization_id_user_id_permission_key_pk" PRIMARY KEY("organization_id","user_id","permission_key")
);
