// RBAC Types for Gharpayy

export type AppRole = 'admin' | 'manager' | 'agent' | 'owner' | 'viewer';

export interface UserRole {
  user_id: string;
  role: AppRole;
  zone_id?: string;
  scope?: string;
  created_at: string;
}

export interface Permission {
  id: string;
  role: AppRole;
  resource: string;
  action: 'read' | 'create' | 'update' | 'delete' | 'manage';
  scope?: string;
  created_at: string;
}

export interface RolePermissions {
  [role: string]: {
    [resource: string]: string[];
  };
}

export const ROLE_HIERARCHY: Record<AppRole, number> = {
  admin: 100,
  manager: 80,
  agent: 50,
  owner: 60,
  viewer: 20,
};

export const PERMISSIONS: RolePermissions = {
  admin: {
    leads: ['read', 'create', 'update', 'delete', 'manage'],
    properties: ['read', 'create', 'update', 'delete', 'manage'],
    bookings: ['read', 'create', 'update', 'delete', 'manage'],
    agents: ['read', 'create', 'update', 'delete', 'manage'],
    owners: ['read', 'create', 'update', 'delete', 'manage'],
    zones: ['read', 'create', 'update', 'delete', 'manage'],
    team_queues: ['read', 'create', 'update', 'delete', 'manage'],
    payments: ['read', 'create', 'update', 'delete', 'manage'],
    notifications: ['read', 'create', 'update', 'delete', 'manage'],
    settings: ['read', 'create', 'update', 'delete', 'manage'],
  },
  manager: {
    leads: ['read', 'create', 'update', 'delete'],
    properties: ['read', 'create', 'update'],
    bookings: ['read', 'create', 'update', 'delete'],
    agents: ['read', 'create', 'update'],
    owners: ['read'],
    zones: ['read'],
    team_queues: ['read', 'create', 'update'],
    payments: ['read', 'create', 'update'],
    notifications: ['read', 'create'],
    settings: ['read'],
  },
  agent: {
    leads: ['read', 'create', 'update'],
    properties: ['read'],
    bookings: ['read', 'create', 'update'],
    agents: ['read'],
    owners: ['read'],
    zones: ['read'],
    team_queues: ['read'],
    payments: ['read'],
    notifications: ['read', 'create'],
    settings: ['read'],
  },
  owner: {
    leads: ['read'],
    properties: ['read', 'create', 'update'],
    bookings: ['read'],
    agents: ['read'],
    owners: ['read'],
    zones: ['read'],
    team_queues: ['read'],
    payments: ['read'],
    notifications: ['read'],
    settings: ['read'],
  },
  viewer: {
    leads: ['read'],
    properties: ['read'],
    bookings: ['read'],
    agents: ['read'],
    owners: ['read'],
    zones: ['read'],
    team_queues: ['read'],
    payments: ['read'],
    notifications: ['read'],
    settings: ['read'],
  },
};
