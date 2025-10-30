-- RBAC enums
DO $$ BEGIN
  CREATE TYPE role_type AS ENUM ('admin','member','staff','volunteer','fellow','super-user','resident');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE permission_effect AS ENUM ('allow','deny');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- permissions
CREATE TABLE IF NOT EXISTS permissions (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  key VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT now() NOT NULL,
  updated_at TIMESTAMP DEFAULT now() NOT NULL
);

-- role_type_permissions
CREATE TABLE IF NOT EXISTS role_type_permissions (
  organization_id TEXT NOT NULL,
  role_type role_type NOT NULL,
  permission_key VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT now() NOT NULL,
  updated_at TIMESTAMP DEFAULT now() NOT NULL,
  PRIMARY KEY (organization_id, role_type, permission_key)
);

-- user_permission_overrides
CREATE TABLE IF NOT EXISTS user_permission_overrides (
  organization_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  permission_key VARCHAR(255) NOT NULL,
  effect permission_effect NOT NULL,
  created_at TIMESTAMP DEFAULT now() NOT NULL,
  updated_at TIMESTAMP DEFAULT now() NOT NULL,
  PRIMARY KEY (organization_id, user_id, permission_key)
);


