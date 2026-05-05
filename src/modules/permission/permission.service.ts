import { Injectable } from '@nestjs/common';
import { RegistryPrismaService } from 'src/infra/prisma/registry-prisma.service';

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: RegistryPrismaService) {}

  async findAll() {
    return this.prisma.permission.findMany({
      orderBy: { key: 'asc' },
    });
  }
}
