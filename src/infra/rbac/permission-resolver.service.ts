import { Injectable } from '@nestjs/common';
import { RegistryPrismaService } from 'src/infra/prisma/registry-prisma.service';

@Injectable()
export class PermissionResolver {
  constructor(private readonly prisma: RegistryPrismaService) {}

  async resolve(userId: string) {
    // 1. Roles do usuário
    const userRoles = await this.prisma.user.findMany({
      where: { id: userId },
      select: {
        roleId: true,
        role: { select: { name: true } },
      },
    });

    const roleIds = userRoles.map((r) => r.roleId).filter(Boolean) as string[];
    const roleNames = userRoles
      .map((r) => r.role?.name)
      .filter(Boolean) as string[];

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
