import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RegistryPrismaService } from 'src/infra/prisma/registry-prisma.service';
import { CreateIntegrationRequestDto } from './dto/create-integration-request.dto';
import { EmailService } from 'src/infra/email/email.service';
import { EnvService } from 'src/config/env/env.service';

@Injectable()
export class IntegrationRequestService {
  private readonly logger = new Logger(IntegrationRequestService.name);

  constructor(
    private readonly prisma: RegistryPrismaService,
    private readonly emailService: EmailService,
    private readonly env: EnvService,
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
        status: 'AWAITING_CONFIRMATION',
      },
    });

    this.logger.log(
      `Nova solicitação de integração (Aguardando Confirmação): ${request.id} - ${request.clientName}`,
    );

    const baseUrl = this.env.get('NODE_ENV') === 'production' 
      ? 'https://info-api.infobrasilsistemas.com.br' 
      : `http://localhost:${this.env.get('PORT') || 3000}`;

    const confirmUrl = `${baseUrl}/integration/confirm/${request.id}`;

    // Notificar Cliente para Confirmar E-mail
    this.emailService.sendEmail(
      dto.technicalContact.email,
      'Confirmação de E-mail - Solicitação de Integração InfoBrasil',
      `
      <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px;">
        <h2 style="color: #059669; margin-top: 0;">Falta pouco!</h2>
        <p>Olá, <strong>${dto.technicalContact.name}</strong>.</p>
        <p>Recebemos sua solicitação de integração para o cliente <strong>${request.clientName}</strong>.</p>
        <p>Para que possamos prosseguir com a análise técnica, por favor confirme seu e-mail clicando no botão abaixo:</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${confirmUrl}" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Confirmar meu E-mail</a>
        </div>
        <p style="font-size: 0.85rem; color: #666;">Se o botão não funcionar, copie e cole o link abaixo no seu navegador:</p>
        <p style="font-size: 0.85rem; color: #059669; word-break: break-all;">${confirmUrl}</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;">
        <p style="font-weight: bold; margin-bottom: 4px;">InfoBrasil Sistemas</p>
        <p style="font-size: 0.8rem; color: #94a3b8; margin-top: 0;">Este é um e-mail automático, não é necessário responder.</p>
      </div>
      `,
    ).catch(err => this.logger.error('Erro ao enviar e-mail de confirmação', err.stack));

    return request;
  }

  async confirm(id: string) {
    const request = await this.prisma.integrationRequest.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Solicitação não encontrada');
    }

    if (request.status !== 'AWAITING_CONFIRMATION') {
      return { message: 'E-mail já confirmado ou solicitação em outro estado.', status: request.status };
    }

    const updatedRequest = await this.prisma.integrationRequest.update({
      where: { id },
      data: { status: 'PENDING' },
    });

    this.logger.log(`E-mail confirmado para solicitação: ${id} - ${request.clientName}`);

    // Agora sim, notificar Suporte e Cliente que o processo começou
    this.notifyOnConfirmation(updatedRequest);

    return { message: 'E-mail confirmado com sucesso!', status: 'PENDING' };
  }

  private async notifyOnConfirmation(request: any) {
    // Notificar Suporte
    this.emailService.sendToSupport(
      `Nova Solicitação de Integração: ${request.clientName}`,
      `
      <div style="font-family: sans-serif; color: #333;">
        <h2 style="color: #059669;">Nova Solicitação de Integração</h2>
        <p>Uma nova solicitação foi <strong>confirmada via e-mail</strong> e está pronta para análise:</p>
        <ul>
          <li><strong>Cliente:</strong> ${request.clientName}</li>
          <li><strong>CNPJ:</strong> ${request.cnpj}</li>
          <li><strong>Hospedagem:</strong> ${request.hostingType}</li>
          <li><strong>Módulos:</strong> ${request.modules.join(', ')}</li>
        </ul>
        <p><a href="https://info-api.infobrasilsistemas.com.br/integration/admin" style="background: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Acessar Painel Admin</a></p>
      </div>
      `,
    ).catch(err => this.logger.error('Erro ao notificar suporte pós-confirmação', err.stack));

    // Notificar Cliente
    this.emailService.sendEmail(
      request.technicalContact.email,
      'Solicitação de Integração Recebida - InfoBrasil',
      `
      <div style="font-family: sans-serif; color: #333;">
        <h2 style="color: #059669;">Olá, ${request.technicalContact.name}</h2>
        <p>Seu e-mail foi confirmado com sucesso!</p>
        <p>Sua solicitação de integração para o cliente <strong>${request.clientName}</strong> agora está em nossa fila de análise.</p>
        <p>Nossa equipe técnica irá analisar os dados e entraremos em contato em breve.</p>
        <hr>
        <p style="font-weight: bold;">InfoBrasil Sistemas</p>
      </div>
      `,
    ).catch(err => this.logger.error('Erro ao notificar cliente pós-confirmação', err.stack));
  }

  async findAll() {
    return this.prisma.integrationRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: string, rejectionReason?: string) {
    const existing = await this.prisma.integrationRequest.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Solicitação não encontrada');

    if (existing.status === 'AWAITING_CONFIRMATION') {
      throw new ForbiddenException(
        'Esta solicitação ainda não foi confirmada via e-mail pelo cliente.',
      );
    }

    const request = await this.prisma.integrationRequest.update({
      where: { id },
      data: { status, rejectionReason },
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
          : `
            <p>Infelizmente sua solicitação não foi aprovada neste momento.</p>
            ${rejectionReason ? `<p><strong>Motivo da recusa:</strong> ${rejectionReason}</p>` : ''}
            <p>Para mais detalhes ou para realizar uma nova solicitação corrigida, entre em contato com nosso suporte.</p>
            `
        }
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
