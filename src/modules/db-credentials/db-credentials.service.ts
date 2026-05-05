import { Injectable, NotFoundException } from '@nestjs/common';
import { RegistryPrismaService } from 'src/infra/prisma/registry-prisma.service';
import { CreateDbCredentialsDto, UpdateDbCredentialsDto } from './dto/db-credentials.dto';

@Injectable()
export class DbCredentialsService {
  constructor(private readonly prisma: RegistryPrismaService) { }

  async create(data: CreateDbCredentialsDto) {
    return this.prisma.dbCredentials.create({
      data: { ...data },
    });
  }

  async findAll() {
    return this.prisma.dbCredentials.findMany({
      orderBy: { database: 'asc' },
    });
  }

  async findOne(id: string) {
    const creds = await this.prisma.dbCredentials.findUnique({
      where: { id },
    });

    if (!creds) {
      throw new NotFoundException('Credenciais não encontradas');
    }

    return creds;
  }

  async update(id: string, data: UpdateDbCredentialsDto) {
    return this.prisma.dbCredentials.update({
      where: { id },
      data: { ...data },
    });
  }

  async remove(id: string) {
    return this.prisma.dbCredentials.delete({
      where: { id },
    });
  }
}
