import { Injectable } from '@nestjs/common';
import { RegistryPrismaService } from '../registry/registry-prisma.service';

@Injectable()
export class PermissionResolver {
  constructor(private readonly prisma: RegistryPrismaService) {}

  async resolve(userId: number) {
    // 1. Roles do usuário
    const userRoles = await this.prisma.user.findMany({
      where: { id: userId },
      select: {
        roleId: true,
        role_id: { select: { name: true } },
      },
    });

    const roleIds = userRoles.map((r) => r.roleId);
    const roleNames = userRoles.map((r) => r.role_id.name);

    // 2. Permissões via roles
    const rolePerms = roleIds.length
      ? await this.prisma.rolePermission.findMany({
          where: { roleId: { in: roleIds } },
          select: { permission: { select: { key: true } } },
        })
      : [];

    const viaRoles = new Set<string>(rolePerms.map((rp) => rp.permission.key));
    const allow = new Set<string>();

    // 4. Merge final
    const allowed = new Set<string>(viaRoles);

    return {
      userId,
      roles: roleNames,
      allowedKeys: allowed,
    };
  }
}
