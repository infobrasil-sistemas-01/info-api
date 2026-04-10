// src/infra/rbac/permissions.types.ts

export type PermissionsRequirement = {
  allOf?: string[];
  anyOf?: string[];
};

export type PermissionSnapshot = {
  userId: number;

  roles: string[];

  allowedKeys: Set<string>;
};

export type ResolvePermissionsOptions = {
  /** bypass do cache por request (debug) */
  bypassCache?: boolean;
};
