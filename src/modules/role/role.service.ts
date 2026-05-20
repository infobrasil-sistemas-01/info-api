import { Injectable, NotFoundException } from '@nestjs/common';
import { RegistryPrismaService } from 'src/infra/prisma/registry-prisma.service';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: RegistryPrismaService) {}

  async create(data: CreateRoleDto) {
    const { permissions, ...roleData } = data;

    return this.prisma.$transaction(async (tx) => {
      const role = await tx.role.create({
        data: roleData,
      });

      if (permissions && permissions.length > 0) {
        await tx.rolePermission.createMany({
          data: permissions.map((pId) => ({
            roleId: role.id,
            permissionId: pId,
          })),
        });
      }

      return role;
    });
  }

  async findAll() {
    return this.prisma.role.findMany({
      include: {
        _count: {
          select: { users: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        rolePermissions: {
          include: { permission: true },
        },
      },
    });

    if (!role) {
      throw new NotFoundException('Role não encontrada');
    }

    return role;
  }

  async update(id: string, data: UpdateRoleDto) {
    const { permissions, ...roleData } = data;

    return this.prisma.$transaction(async (tx) => {
      const role = await tx.role.update({
        where: { id },
        data: roleData,
      });

      if (permissions !== undefined) {
        // Remove antigas
        await tx.rolePermission.deleteMany({
          where: { roleId: id },
        });

        // Adiciona novas
        if (permissions.length > 0) {
          await tx.rolePermission.createMany({
            data: permissions.map((pId) => ({
              roleId: id,
              permissionId: pId,
            })),
          });
        }
      }

      return role;
    });
  }

  async remove(id: string) {
    // Verificar se existem usuários vinculados?
    const userCount = await this.prisma.user.count({ where: { roleId: id } });
    if (userCount > 0) {
      throw new Error(
        'Não é possível excluir uma role que possui usuários vinculados.',
      );
    }

    return this.prisma.role.delete({
      where: { id },
    });
  }
}
