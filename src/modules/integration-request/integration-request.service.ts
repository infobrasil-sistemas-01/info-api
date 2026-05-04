import { Injectable, Logger } from '@nestjs/common';
import { RegistryPrismaService } from 'src/infra/prisma/registry-prisma.service';
import { CreateIntegrationRequestDto } from './dto/create-integration-request.dto';

@Injectable()
export class IntegrationRequestService {
  private readonly logger = new Logger(IntegrationRequestService.name);

  constructor(private readonly prisma: RegistryPrismaService) {}

  async create(dto: CreateIntegrationRequestDto) {
    const request = await this.prisma.integrationRequest.create({
      data: {
        clientName: dto.clientName,
        legalName: dto.legalName,
        cnpj: dto.cnpj,
        hostingType: dto.hostingType,
        fixedIp: dto.fixedIp,
        database: dto.database as any,
        stores: dto.stores,
        modules: dto.modules,
        scopes: dto.scopes as any,
        objective: dto.objective,
        technicalContact: dto.technicalContact as any,
      },
    });

    this.logger.log(
      `Nova solicitação de integração criada: ${request.id} - ${request.clientName}`,
    );
    return request;
  }

  async findAll() {
    return this.prisma.integrationRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.integrationRequest.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: string) {
    return this.prisma.integrationRequest.delete({
      where: { id },
    });
  }
}
