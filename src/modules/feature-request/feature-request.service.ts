import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RegistryPrismaService } from 'src/infra/prisma/registry-prisma.service';
import { EmailService } from 'src/infra/email/email.service';
import { CreateFeatureRequestDto } from './dto/create-feature-request.dto';
import { RespondFeatureRequestDto } from './dto/respond-feature-request.dto';

@Injectable()
export class FeatureRequestService {
  private readonly logger = new Logger(FeatureRequestService.name);

  constructor(
    private readonly prisma: RegistryPrismaService,
    private readonly emailService: EmailService,
  ) {}

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
      },
    });

    // Notificação por e-mail para a equipe administrativa
    try {
      const subject = `[InfoAPI] Nova Solicitação de Funcionalidade - ${user.user}`;
      const safeText = dto.requestText.trim().replace(/\n/g, '<br>');
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
          <div style="background: #0f172a; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h2 style="color: #10b981; margin: 0; font-size: 22px;">Nova Solicitação de Funcionalidade</h2>
          </div>
          <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; background: #ffffff;">
            <p style="font-size: 15px; margin-top: 0;">Um cliente abriu uma nova solicitação de funcionalidade pelo painel:</p>
            <div style="background: #f8fafc; padding: 16px; border-left: 4px solid #10b981; border-radius: 4px; margin: 16px 0;">
              <p style="margin: 0 0 8px 0;"><strong>Cliente / Usuário:</strong> ${user.user}</p>
              <p style="margin: 0 0 8px 0;"><strong>E-mail:</strong> ${user.email || 'Não informado'}</p>
              <p style="margin: 0;"><strong>Data / Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
            </div>
            <h4 style="color: #334155; margin-bottom: 8px;">Descrição da Solicitação:</h4>
            <div style="background: #f1f5f9; padding: 16px; border-radius: 6px; white-space: pre-wrap; font-size: 14px; color: #0f172a;">
              ${safeText}
            </div>
            <p style="font-size: 13px; color: #64748b; margin-top: 24px; text-align: center;">
              Acesse a sub-aba de Funcionalidades no painel administrativo para responder a este cliente.
            </p>
          </div>
        </div>
      `;

      await this.emailService.sendToSupport(subject, html);
      this.logger.log(`E-mail de nova solicitação enviado ao suporte para o cliente ${user.user}`);
    } catch (err: any) {
      this.logger.warn(
        `Falha ao disparar e-mail de nova solicitação ao suporte: ${err.message}`,
        err.stack,
      );
    }

    return featureRequest;
  }

  async findAll(status?: string) {
    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    return this.prisma.featureRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, user: true, email: true },
        },
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.featureRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async respond(id: string, dto: RespondFeatureRequestDto) {
    const existing = await this.prisma.featureRequest.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, user: true, email: true },
        },
      },
    });

    if (!existing) {
      throw new NotFoundException('Solicitação de funcionalidade não encontrada');
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
      },
    });

    // Notificação por e-mail para o cliente (se possuir e-mail cadastrado)
    const clientEmail = updated.user?.email;
    if (clientEmail) {
      try {
        const subject = `[InfoAPI] Atualização sobre sua Solicitação de Funcionalidade`;
        const safeReq = existing.requestText.trim().replace(/\n/g, '<br>');
        const safeResp = dto.responseText.trim().replace(/\n/g, '<br>');

        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
            <div style="background: #0f172a; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
              <h2 style="color: #10b981; margin: 0; font-size: 22px;">Retorno da Sua Solicitação</h2>
            </div>
            <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; background: #ffffff;">
              <p style="font-size: 15px; margin-top: 0;">Olá <strong>${updated.user.user}</strong>,</p>
              <p style="font-size: 15px;">A equipe da InfoBrasil analisou sua solicitação de funcionalidade e enviou o seguinte retorno:</p>
              
              <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 16px; border-radius: 6px; margin: 16px 0; color: #065f46;">
                <h4 style="margin: 0 0 8px 0; color: #047857;">Resposta da Equipe:</h4>
                <div style="font-size: 14px; white-space: pre-wrap;">${safeResp}</div>
              </div>

              <h4 style="color: #64748b; font-size: 13px; text-transform: uppercase; margin-bottom: 6px;">Sua Solicitação Original:</h4>
              <div style="background: #f8fafc; padding: 14px; border-radius: 6px; font-size: 13px; color: #475569; border: 1px solid #e2e8f0;">
                ${safeReq}
              </div>

              <p style="font-size: 13px; color: #64748b; margin-top: 24px; text-align: center;">
                Você também pode consultar o histórico de suas solicitações diretamente na aba <strong>Solicitações</strong> do painel InfoAPI.
              </p>
            </div>
          </div>
        `;

        await this.emailService.sendEmail(clientEmail, subject, html);
        this.logger.log(`E-mail de resposta enviado com sucesso para ${clientEmail}`);
      } catch (err: any) {
        this.logger.warn(
          `Falha ao disparar e-mail de resposta para o cliente (${clientEmail}): ${err.message}`,
          err.stack,
        );
      }
    } else {
      this.logger.log(
        `Cliente ${updated.user?.user} não possui e-mail cadastrado. Notificação por e-mail ignorada.`,
      );
    }

    return updated;
  }
}
