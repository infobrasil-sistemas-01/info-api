import { Injectable, Logger } from '@nestjs/common';
import { RegistryPrismaService } from 'src/infra/prisma/registry-prisma.service';
import { CreateIntegrationRequestDto } from './dto/create-integration-request.dto';
import { EmailService } from 'src/infra/email/email.service';

@Injectable()
export class IntegrationRequestService {
  private readonly logger = new Logger(IntegrationRequestService.name);

  constructor(
    private readonly prisma: RegistryPrismaService,
    private readonly emailService: EmailService,
  ) {}

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

    // Notificar Suporte
    this.emailService.sendToSupport(
      `Nova Solicitação de Integração: ${request.clientName}`,
      `
      <div style="font-family: sans-serif; color: #333;">
        <h2 style="color: #059669;">Nova Solicitação de Integração</h2>
        <p>Uma nova solicitação foi recebida via portal:</p>
        <ul>
          <li><strong>Cliente:</strong> ${request.clientName}</li>
          <li><strong>CNPJ:</strong> ${request.cnpj}</li>
          <li><strong>Hospedagem:</strong> ${request.hostingType}</li>
          <li><strong>Módulos:</strong> ${request.modules.join(', ')}</li>
        </ul>
        <p><a href="https://info-api.infobrasilsistemas.com.br/integration/admin" style="background: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Acessar Painel Admin</a></p>
      </div>
      `,
    ).catch(err => this.logger.error('Erro ao notificar suporte', err.stack));

    // Notificar Cliente
    this.emailService.sendEmail(
      dto.technicalContact.email,
      'Solicitação de Integração Recebida - InfoBrasil',
      `
      <div style="font-family: sans-serif; color: #333;">
        <h2 style="color: #059669;">Olá, ${dto.technicalContact.name}</h2>
        <p>Recebemos sua solicitação de integração para o cliente <strong>${request.clientName}</strong>.</p>
        <p>Nossa equipe técnica irá analisar os dados e entraremos em contato em breve.</p>
        <p style="color: #666; font-size: 0.9rem;">Este é um e-mail automático, não é necessário responder.</p>
        <hr>
        <p style="font-weight: bold;">InfoBrasil Sistemas</p>
      </div>
      `,
    ).catch(err => this.logger.error('Erro ao notificar cliente', err.stack));

    return request;
  }

  async findAll() {
    return this.prisma.integrationRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: string) {
    const request = await this.prisma.integrationRequest.update({
      where: { id },
      data: { status },
    });

    const statusTraduzido = status === 'APPROVED' ? 'APROVADA' : 'RECUSADA';
    const cor = status === 'APPROVED' ? '#059669' : '#ef4444';

    // Notificar Cliente sobre mudança de status
    this.emailService.sendEmail(
      (request.technicalContact as any).email,
      `Sua solicitação de integração foi ${statusTraduzido}`,
      `
      <div style="font-family: sans-serif; color: #333;">
        <h2 style="color: ${cor};">Solicitação ${statusTraduzido}</h2>
        <p>Olá, temos uma atualização sobre a solicitação de integração do cliente <strong>${request.clientName}</strong>.</p>
        <p>O status atual é: <span style="font-weight: bold; color: ${cor};">${statusTraduzido}</span></p>
        ${status === 'APPROVED' 
          ? '<p>Nossa equipe entrará em contato para fornecer as chaves de acesso e próximos passos.</p>' 
          : '<p>Infelizmente sua solicitação não foi aprovada neste momento. Para mais detalhes, entre em contato com nosso suporte.</p>'}
        <hr>
        <p style="font-weight: bold;">InfoBrasil Sistemas</p>
      </div>
      `
    ).catch(err => this.logger.error('Erro ao notificar cliente sobre status', err.stack));

    return request;
  }

  async remove(id: string) {
    return this.prisma.integrationRequest.delete({
      where: { id },
    });
  }
}
