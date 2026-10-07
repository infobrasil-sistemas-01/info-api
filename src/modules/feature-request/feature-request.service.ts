import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { RegistryPrismaService } from 'src/infra/prisma/registry-prisma.service';
import { EmailService } from 'src/infra/email/email.service';
import { CreateFeatureRequestDto } from './dto/create-feature-request.dto';
import { RespondFeatureRequestDto } from './dto/respond-feature-request.dto';
import { CreateFeatureRequestMessageDto } from './dto/create-feature-request-message.dto';
import { ResolveFeatureRequestDto } from './dto/resolve-feature-request.dto';
import type { JwtPayload } from 'src/modules/auth/types/jwt-payload';

@Injectable()
export class FeatureRequestService {
  private readonly logger = new Logger(FeatureRequestService.name);
  private readonly baseUrl = 'https://info-api.infobrasilsistemas.com.br';

  constructor(
    private readonly prisma: RegistryPrismaService,
    private readonly emailService: EmailService,
  ) {}

  private getTicketNumber(id: string): string {
    return id ? id.split('-')[0].toUpperCase() : '';
  }

  private enrichTicket<T extends { id: string }>(
    item: T,
  ): T & { ticketNumber: string } {
    return {
      ...item,
      ticketNumber: `#${this.getTicketNumber(item.id)}`,
    };
  }

  async create(userId: string, dto: CreateFeatureRequestDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, user: true, email: true },
    });

    if (!user) {
      throw new NotFoundException('Usuário solicitante não encontrado');
    }

    const featureRequest = await this.prisma.featureRequest.create({
      data: {
        userId,
        requestText: dto.requestText.trim(),
        status: 'PENDING',
      },
      include: {
        user: {
          select: { id: true, user: true, email: true },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: {
                id: true,
                user: true,
                email: true,
                role: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    const ticketNumber = this.getTicketNumber(featureRequest.id);
    const enriched = this.enrichTicket(featureRequest);

    // Notificação por e-mail para a equipe de suporte/administração
    try {
      const subject = `[InfoAPI] Nova Solicitação de Funcionalidade - Ticket #${ticketNumber} (${user.user})`;
      const safeText = dto.requestText.trim().replace(/\n/g, '<br>');
      const adminUrl = `${this.baseUrl}/integration/admin#requests`;

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
          <div style="background: #0f172a; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <span style="background: #10b981; color: #ffffff; font-size: 12px; font-weight: bold; padding: 4px 10px; border-radius: 12px; text-transform: uppercase;">Ticket #${ticketNumber}</span>
            <h2 style="color: #ffffff; margin: 10px 0 0 0; font-size: 20px;">Nova Solicitação de Funcionalidade</h2>
          </div>
          <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; background: #ffffff;">
            <p style="font-size: 15px; margin-top: 0;">Um cliente abriu uma nova solicitação de funcionalidade pelo painel:</p>
            <div style="background: #f8fafc; padding: 16px; border-left: 4px solid #10b981; border-radius: 4px; margin: 16px 0;">
              <p style="margin: 0 0 6px 0;"><strong>Número do Ticket:</strong> #${ticketNumber}</p>
              <p style="margin: 0 0 6px 0;"><strong>Cliente / Usuário:</strong> ${user.user}</p>
              <p style="margin: 0 0 6px 0;"><strong>E-mail:</strong> ${user.email || 'Não informado'}</p>
              <p style="margin: 0;"><strong>Data / Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
            </div>
            <h4 style="color: #334155; margin-bottom: 8px;">Descrição da Solicitação:</h4>
            <div style="background: #f1f5f9; padding: 16px; border-radius: 6px; white-space: pre-wrap; font-size: 14px; color: #0f172a;">
              ${safeText}
            </div>
            <div style="margin-top: 24px; text-align: center;">
              <a href="${adminUrl}" style="background: #10b981; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Acessar Solicitação no Painel
              </a>
            </div>
          </div>
        </div>
      `;

      await this.emailService.sendToSupport(subject, html);
      this.logger.log(
        `E-mail de novo ticket #${ticketNumber} enviado ao suporte para o cliente ${user.user}`,
      );
    } catch (err: any) {
      this.logger.warn(
        `Falha ao disparar e-mail de novo ticket #${ticketNumber} ao suporte: ${err.message}`,
        err.stack,
      );
    }

    return enriched;
  }

  async findAll(status?: string) {
    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const list = await this.prisma.featureRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, user: true, email: true },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: {
                id: true,
                user: true,
                email: true,
                role: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    return list.map((item) => this.enrichTicket(item));
  }

  async findByUser(userId: string) {
    const list = await this.prisma.featureRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: {
                id: true,
                user: true,
                email: true,
                role: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    return list.map((item) => this.enrichTicket(item));
  }

  async findOne(id: string, currentUser?: JwtPayload) {
    const item = await this.prisma.featureRequest.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, user: true, email: true },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: {
                id: true,
                user: true,
                email: true,
                role: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    if (!item) {
      throw new NotFoundException(
        'Solicitação de funcionalidade não encontrada',
      );
    }

    if (currentUser && currentUser.sub !== item.userId) {
      const requester = await this.prisma.user.findUnique({
        where: { id: currentUser.sub },
        select: { role: { select: { name: true } } },
      });
      if (requester?.role?.name !== 'Admin') {
        throw new ForbiddenException(
          'Acesso não autorizado a esta solicitação',
        );
      }
    }

    return this.enrichTicket(item);
  }

  async addMessage(
    id: string,
    senderId: string,
    dto: CreateFeatureRequestMessageDto,
  ) {
    const request = await this.prisma.featureRequest.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, user: true, email: true },
        },
      },
    });

    if (!request) {
      throw new NotFoundException(
        'Solicitação de funcionalidade não encontrada',
      );
    }

    if (request.status === 'RESOLVED') {
      throw new BadRequestException(
        'Este ticket já foi resolvido e está fechado para novas mensagens.',
      );
    }

    const sender = await this.prisma.user.findUnique({
      where: { id: senderId },
      include: { role: true },
    });

    if (!sender) {
      throw new NotFoundException('Usuário remetente não encontrado');
    }

    const isClient = sender.id === request.userId;
    const isAdmin = sender.role?.name === 'Admin';

    if (!isClient && !isAdmin) {
      throw new ForbiddenException(
        'Você não tem permissão para responder nesta solicitação',
      );
    }

    // Salva a nova mensagem na conversa
    const messageRecord = await this.prisma.featureRequestMessage.create({
      data: {
        featureRequestId: id,
        senderId,
        message: dto.message.trim(),
      },
      include: {
        sender: {
          select: {
            id: true,
            user: true,
            email: true,
            role: { select: { name: true } },
          },
        },
      },
    });

    // Se admin respondeu: status ANSWERED. Se cliente replicou: volta para PENDING
    const nextStatus = isClient ? 'PENDING' : 'ANSWERED';
    await this.prisma.featureRequest.update({
      where: { id },
      data: {
        status: nextStatus,
        responseText: !isClient ? dto.message.trim() : request.responseText,
        answeredAt: !isClient ? new Date() : request.answeredAt,
      },
    });

    const ticketNumber = this.getTicketNumber(request.id);
    const safeMsg = dto.message.trim().replace(/\n/g, '<br>');

    // Disparos de notificação por e-mail com link direto para a solicitação
    if (!isClient) {
      // Admin respondeu -> Notificar o Cliente
      const clientEmail = request.user?.email;
      if (clientEmail) {
        try {
          const clientUrl = `${this.baseUrl}/integration/client#requests`;
          const subject = `[InfoAPI] Nova resposta no Ticket #${ticketNumber} - InfoBrasil`;
          const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
              <div style="background: #0f172a; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
                <span style="background: #10b981; color: #ffffff; font-size: 12px; font-weight: bold; padding: 4px 10px; border-radius: 12px; text-transform: uppercase;">Ticket #${ticketNumber}</span>
                <h2 style="color: #ffffff; margin: 10px 0 0 0; font-size: 20px;">Nova Resposta da Equipe</h2>
              </div>
              <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; background: #ffffff;">
                <p style="font-size: 15px; margin-top: 0;">Olá <strong>${request.user.user}</strong>,</p>
                <p style="font-size: 15px;">A equipe da InfoBrasil enviou uma nova resposta na conversa da sua solicitação:</p>
                
                <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 16px; border-radius: 6px; margin: 16px 0; color: #065f46;">
                  <h4 style="margin: 0 0 8px 0; color: #047857;">Mensagem da Equipe InfoBrasil:</h4>
                  <div style="font-size: 14px; white-space: pre-wrap;">${safeMsg}</div>
                </div>

                <div style="margin-top: 24px; text-align: center;">
                  <a href="${clientUrl}" style="background: #10b981; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                    Ver Conversa e Responder no Painel
                  </a>
                </div>
              </div>
            </div>
          `;

          await this.emailService.sendEmail(clientEmail, subject, html);
          this.logger.log(
            `E-mail de resposta no ticket #${ticketNumber} enviado para ${clientEmail}`,
          );
        } catch (err: any) {
          this.logger.warn(
            `Falha ao disparar e-mail de resposta no ticket #${ticketNumber} ao cliente: ${err.message}`,
            err.stack,
          );
        }
      }
    } else {
      // Cliente replicou -> Notificar a equipe de suporte
      try {
        const adminUrl = `${this.baseUrl}/integration/admin#requests`;
        const subject = `[InfoAPI] Réplica do Cliente no Ticket #${ticketNumber} - ${request.user.user}`;
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
            <div style="background: #0f172a; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
              <span style="background: #f59e0b; color: #ffffff; font-size: 12px; font-weight: bold; padding: 4px 10px; border-radius: 12px; text-transform: uppercase;">Ticket #${ticketNumber} - Réplica</span>
              <h2 style="color: #ffffff; margin: 10px 0 0 0; font-size: 20px;">Nova Mensagem do Cliente</h2>
            </div>
            <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; background: #ffffff;">
              <p style="font-size: 15px; margin-top: 0;">O cliente <strong>${request.user.user}</strong> enviou uma nova mensagem na conversa do ticket:</p>
              
              <div style="background: #f8fafc; padding: 16px; border-left: 4px solid #f59e0b; border-radius: 4px; margin: 16px 0;">
                <p style="margin: 0 0 6px 0;"><strong>Ticket:</strong> #${ticketNumber}</p>
                <p style="margin: 0 0 6px 0;"><strong>Cliente:</strong> ${request.user.user} (${request.user.email || 'Sem e-mail'})</p>
                <p style="margin: 0;"><strong>Data / Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
              </div>

              <div style="background: #f1f5f9; padding: 16px; border-radius: 6px; white-space: pre-wrap; font-size: 14px; color: #0f172a;">
                ${safeMsg}
              </div>

              <div style="margin-top: 24px; text-align: center;">
                <a href="${adminUrl}" style="background: #0284c7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Acessar Conversa no Painel Admin
                </a>
              </div>
            </div>
          </div>
        `;

        await this.emailService.sendToSupport(subject, html);
        this.logger.log(
          `E-mail de réplica no ticket #${ticketNumber} enviado ao suporte`,
        );
      } catch (err: any) {
        this.logger.warn(
          `Falha ao disparar e-mail de réplica no ticket #${ticketNumber} ao suporte: ${err.message}`,
          err.stack,
        );
      }
    }

    return messageRecord;
  }

  async resolve(
    id: string,
    adminUserId: string,
    dto?: ResolveFeatureRequestDto,
  ) {
    const request = await this.prisma.featureRequest.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, user: true, email: true },
        },
      },
    });

    if (!request) {
      throw new NotFoundException(
        'Solicitação de funcionalidade não encontrada',
      );
    }

    // Se houver mensagem de encerramento, registra na conversa
    if (dto?.closingMessage && dto.closingMessage.trim().length > 0) {
      await this.prisma.featureRequestMessage.create({
        data: {
          featureRequestId: id,
          senderId: adminUserId,
          message: dto.closingMessage.trim(),
        },
      });
    }

    const updated = await this.prisma.featureRequest.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
        responseText: dto?.closingMessage
          ? dto.closingMessage.trim()
          : request.responseText,
      },
      include: {
        user: {
          select: { id: true, user: true, email: true },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: {
                id: true,
                user: true,
                email: true,
                role: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    const ticketNumber = this.getTicketNumber(updated.id);

    // Notificar cliente sobre o encerramento / resolução do ticket
    const clientEmail = updated.user?.email;
    if (clientEmail) {
      try {
        const clientUrl = `${this.baseUrl}/integration/client#requests`;
        const subject = `[InfoAPI] Ticket #${ticketNumber} foi Concluído e Resolvido`;
        const safeClosing = dto?.closingMessage
          ? `<div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 16px; border-radius: 6px; margin: 16px 0; color: #065f46;">
               <h4 style="margin: 0 0 8px 0; color: #047857;">Mensagem de Conclusão:</h4>
               <div style="font-size: 14px; white-space: pre-wrap;">${dto.closingMessage.trim().replace(/\n/g, '<br>')}</div>
             </div>`
          : '';

        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
            <div style="background: #0f172a; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
              <span style="background: #10b981; color: #ffffff; font-size: 12px; font-weight: bold; padding: 4px 10px; border-radius: 12px; text-transform: uppercase;">Ticket #${ticketNumber} - Resolvido</span>
              <h2 style="color: #ffffff; margin: 10px 0 0 0; font-size: 20px;">Sua Solicitação foi Concluída!</h2>
            </div>
            <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; background: #ffffff;">
              <p style="font-size: 15px; margin-top: 0;">Olá <strong>${updated.user.user}</strong>,</p>
              <p style="font-size: 15px;">Informamos que sua solicitação de funcionalidade (Ticket <strong>#${ticketNumber}</strong>) foi formalmente atendida e resolvida pela nossa equipe técnica.</p>
              
              ${safeClosing}

              <div style="margin-top: 24px; text-align: center;">
                <a href="${clientUrl}" style="background: #10b981; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Visualizar Ticket no Painel
                </a>
              </div>
            </div>
          </div>
        `;

        await this.emailService.sendEmail(clientEmail, subject, html);
        this.logger.log(
          `E-mail de resolução do ticket #${ticketNumber} enviado para ${clientEmail}`,
        );
      } catch (err: any) {
        this.logger.warn(
          `Falha ao disparar e-mail de resolução do ticket #${ticketNumber}: ${err.message}`,
          err.stack,
        );
      }
    }

    return this.enrichTicket(updated);
  }

  // Compatibilidade legada com endpoint anterior respond
  async respond(
    id: string,
    dto: RespondFeatureRequestDto,
    adminUserId?: string,
  ) {
    if (adminUserId) {
      await this.addMessage(id, adminUserId, { message: dto.responseText });
      return this.findOne(id);
    }

    const existing = await this.prisma.featureRequest.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, user: true, email: true },
        },
      },
    });

    if (!existing) {
      throw new NotFoundException(
        'Solicitação de funcionalidade não encontrada',
      );
    }

    const updated = await this.prisma.featureRequest.update({
      where: { id },
      data: {
        responseText: dto.responseText.trim(),
        status: 'ANSWERED',
        answeredAt: new Date(),
      },
      include: {
        user: {
          select: { id: true, user: true, email: true },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: {
                id: true,
                user: true,
                email: true,
                role: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    return this.enrichTicket(updated);
  }
}
