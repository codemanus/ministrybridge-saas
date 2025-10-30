export const name = 'rbac';

export type { RbacContext, PermissionKey } from './resolver.js';
export { canAccess, getEffectivePermissions } from './resolver.js';
