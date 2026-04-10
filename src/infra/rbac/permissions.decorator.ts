import { SetMetadata } from '@nestjs/common';
import { PermissionKey } from './catalog/permissions.catalog';

export const PERMISSIONS_META_KEY = 'permissions';

export function RequirePermissions(args: {
  allOf?: readonly PermissionKey[];
  anyOf?: readonly PermissionKey[];
}) {
  return SetMetadata(PERMISSIONS_META_KEY, args);
}
