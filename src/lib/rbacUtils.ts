import { PERMISSIONS, ROLE_HIERARCHY, type AppRole, type RolePermissions } from '@/types/rbac';

/**
 * Check if a user has a specific permission
 */
export const hasPermission = (
  userRole: AppRole,
  resource: string,
  action: string
): boolean => {
  const rolePermissions = PERMISSIONS[userRole];
  if (!rolePermissions) return false;
  
  const resourcePermissions = rolePermissions[resource];
  if (!resourcePermissions) return false;
  
  return resourcePermissions.includes(action as any);
};

/**
 * Check if user has any of the required permissions
 */
export const hasAnyPermission = (
  userRole: AppRole,
  resource: string,
  actions: string[]
): boolean => {
  return actions.some(action => hasPermission(userRole, resource, action));
};

/**
 * Check if user has all required permissions
 */
export const hasAllPermissions = (
  userRole: AppRole,
  resource: string,
  actions: string[]
): boolean => {
  return actions.every(action => hasPermission(userRole, resource, action));
};

/**
 * Get user's effective role (highest role if multiple)
 */
export const getEffectiveRole = (roles: AppRole[]): AppRole => {
  if (roles.length === 0) return 'viewer';
  return roles.reduce((highest, role) => 
    ROLE_HIERARCHY[role] > ROLE_HIERARCHY[highest] ? role : highest
  ) as AppRole;
};

/**
 * Filter data based on user role and ownership
 */
export const filterByRole = <T extends { user_id?: string; owner_id?: string }>(
  data: T[],
  userRole: AppRole,
  userId: string
): T[] => {
  if (userRole === 'admin') return data;
  
  if (userRole === 'owner') {
    return data.filter(item => item.owner_id === userId);
  }
  
  // Agents can only see their own data
  return data.filter(item => item.user_id === userId);
};

/**
 * Get allowed actions for a resource based on role
 */
export const getAllowedActions = (
  userRole: AppRole,
  resource: string
): string[] => {
  const rolePermissions = PERMISSIONS[userRole];
  if (!rolePermissions) return [];
  
  const resourcePermissions = rolePermissions[resource];
  return resourcePermissions || [];
};
