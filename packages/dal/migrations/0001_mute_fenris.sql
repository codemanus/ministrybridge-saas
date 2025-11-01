CREATE UNIQUE INDEX "rbac_permissions_org_key_uq" ON "rbac_permissions" USING btree ("organization_id","key");--> statement-breakpoint
CREATE INDEX "rbac_permissions_org_idx" ON "rbac_permissions" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "rbac_rtp_org_role_idx" ON "rbac_role_type_permissions" USING btree ("organization_id","role_type");--> statement-breakpoint
CREATE INDEX "rbac_rtp_org_perm_idx" ON "rbac_role_type_permissions" USING btree ("organization_id","permission_key");--> statement-breakpoint
CREATE INDEX "rbac_upo_org_user_idx" ON "rbac_user_permission_overrides" USING btree ("organization_id","user_id");--> statement-breakpoint
CREATE INDEX "rbac_upo_org_perm_idx" ON "rbac_user_permission_overrides" USING btree ("organization_id","permission_key");