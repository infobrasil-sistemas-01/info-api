import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { RegistryPrismaService } from 'src/infra/prisma/registry-prisma.service';
import { EmailService } from 'src/infra/email/email.service';
import { SendNewsletterDto } from './dto/send-newsletter.dto';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class NewsletterService {
  private readonly logger = new Logger(NewsletterService.name);

  constructor(
    private readonly prisma: RegistryPrismaService,
    private readonly emailService: EmailService,
  ) {}

  private getApiVersion(): string {
    try {
      const pkgPath = path.resolve(process.cwd(), 'package.json');
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      return pkg.version || '1.0.0';
    } catch {
      return '1.0.0';
    }
  }

  private getLogoBase64(): string {
    try {
      const logoPath = path.resolve(
        process.cwd(),
        'src/modules/integration-request/templates/assets/logo-infoapi-white.png',
      );
      if (fs.existsSync(logoPath)) {
        const logoBuffer = fs.readFileSync(logoPath);
        return `data:image/png;base64,${logoBuffer.toString('base64')}`;
      }
    } catch (e: any) {
      this.logger.error(`Erro ao ler logo em base64: ${e.message}`);
    }
    return '';
  }

  async getNextId(): Promise<number> {
    const lastNewsletter = await this.prisma.newsletter.findMany({
      select: { id: true },
      orderBy: { id: 'desc' },
      take: 1,
    });
    return lastNewsletter.length > 0 ? lastNewsletter[0].id + 1 : 1;
  }

  private generateHtml(
    username: string,
    subject: string,
    initialMessage: string,
    finalMessage: string,
    announcements: any[],
  ): string {
    const logoBase64 = this.getLogoBase64();
    const version = this.getApiVersion();

    const typeStyles: Record<
      string,
      { label: string; bg: string; border: string; text: string; icon: string }
    > = {
      INFO: {
        label: 'Informativo',
        bg: '#ecfdf5',
        border: '#10b981',
        text: '#047857',
        icon: 'ℹ️',
      },
      WARNING: {
        label: 'Aviso',
        bg: '#fffbeb',
        border: '#f59e0b',
        text: '#b45309',
        icon: '⚠️',
      },
      ALERT: {
        label: 'Alerta',
        bg: '#fef2f2',
        border: '#ef4444',
        text: '#b91c1c',
        icon: '🚨',
      },
      DOC: {
        label: 'Documentação',
        bg: '#f5f3ff',
        border: '#8b5cf6',
        text: '#6d28d9',
        icon: '📚',
      },
    };

    const annsHtml = announcements
      .map((ann) => {
        const style = typeStyles[ann.type] || typeStyles.INFO;
        const ctaHtml =
          ann.ctaLink && ann.ctaText
            ? `<div style="margin-top: 12px;">
                 <a href="${ann.ctaLink}" style="background: #10b981; color: white; padding: 6px 12px; font-size: 0.85rem; font-weight: bold; text-decoration: none; border-radius: 6px; display: inline-block;">${ann.ctaText}</a>
               </div>`
            : '';

        return `
        <div style="background: ${style.bg}; border-left: 4px solid ${style.border}; padding: 16px; border-radius: 0 8px 8px 0; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="font-size: 1.1rem; line-height: 1;">${style.icon}</span>
            <span style="font-weight: bold; color: ${style.text}; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em;">${style.label}</span>
          </div>
          <div style="color: #1e293b; font-size: 0.95rem; line-height: 1.5; white-space: pre-wrap;">${ann.text}</div>
          ${ctaHtml}
        </div>`;
      })
      .join('');

    return `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f1f5f9; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); overflow: hidden;">
              <!-- Header -->
              <tr style="background-color: #0f172a; padding: 24px;">
                <td style="padding: 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #1e293b;">
                  <div>
                    ${
                      logoBase64
                        ? `<img src="${logoBase64}" alt="InfoAPI" style="height: 32px; display: block;" />`
                        : `<span style="font-size: 1.5rem; font-weight: bold; color: #ffffff;">Info<span style="color: #10b981;">API</span></span>`
                    }
                  </div>
                  <span style="background-color: rgba(16, 185, 129, 0.15); color: #34d399; font-size: 0.75rem; font-weight: bold; padding: 4px 10px; border-radius: 9999px; border: 1px solid rgba(16, 185, 129, 0.25);">v${version}</span>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 32px 24px;">
                  <h2 style="color: #0f172a; font-size: 1.4rem; margin-top: 0; margin-bottom: 16px; font-weight: 700;">Olá, ${username}!</h2>
                  
                  <p style="color: #475569; font-size: 1rem; line-height: 1.6; margin-top: 0; margin-bottom: 24px;">
                    ${initialMessage}
                  </p>

                  <!-- Announcements Section -->
                  <div style="margin-bottom: 32px;">
                    ${annsHtml}
                  </div>

                  <p style="color: #475569; font-size: 1rem; line-height: 1.6; margin-top: 0; margin-bottom: 0;">
                    ${finalMessage}
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr style="background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
                <td style="padding: 24px; text-align: center;">
                  <p style="margin: 0; color: #0f172a; font-weight: bold; font-size: 0.9rem;">InfoBrasil Sistemas</p>
                  <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 0.8rem;">Este é um e-mail automático enviado para desenvolvedores e parceiros integrados com o ecossistema InfoAPI.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>`;
  }

  async getPreview(
    dto: SendNewsletterDto,
  ): Promise<{ html: string; subject: string; nextId: number }> {
    const nextId = await this.getNextId();
    const announcements = await this.prisma.announcement.findMany({
      where: { id: { in: dto.announcementIds } },
      orderBy: { createdAt: 'desc' },
    });

    if (announcements.length === 0) {
      throw new BadRequestException(
        'Nenhum aviso encontrado para gerar preview.',
      );
    }

    const initial =
      dto.initialMessage ||
      'Olá! Temos o prazer de compartilhar com você as últimas atualizações de recursos, novidades e alertas importantes do ecossistema InfoAPI.';
    const final =
      dto.finalMessage ||
      'Para dúvidas ou suporte com essas novidades, nossa equipe técnica está sempre disponível através do e-mail suporte@infobrasilsistemas.com.br ou pelo nosso suporte oficial.';

    const html = this.generateHtml(
      '[Nome do Usuário]',
      dto.subject,
      initial,
      final,
      announcements,
    );
    return { html, subject: dto.subject, nextId };
  }

  async send(dto: SendNewsletterDto) {
    // 1. Validar avisos
    const announcements = await this.prisma.announcement.findMany({
      where: { id: { in: dto.announcementIds } },
    });

    if (announcements.length === 0) {
      throw new BadRequestException('Nenhum aviso encontrado para enviar.');
    }

    // 2. Verificar duplicados (já enviados)
    const alreadySent = announcements.filter((a) => a.newsletterId !== null);
    if (alreadySent.length > 0) {
      throw new BadRequestException(
        `Os seguintes avisos já foram enviados em outra newsletter: ${alreadySent.map((a) => a.id).join(', ')}`,
      );
    }

    // 3. Processar envio via Transação
    return this.prisma.$transaction(async (tx) => {
      // Cria a Newsletter
      const newsletter = await tx.newsletter.create({
        data: {
          subject: dto.subject,
          initialMessage: dto.initialMessage,
          finalMessage: dto.finalMessage,
        },
      });

      // Associa avisos à newsletter criada
      await tx.announcement.updateMany({
        where: { id: { in: dto.announcementIds } },
        data: { newsletterId: newsletter.id },
      });

      // Busca todos os usuários ativos com e-mail cadastrado
      const activeUsers = await tx.user.findMany({
        where: { status: true, email: { not: null } },
        select: { user: true, email: true },
      });

      if (activeUsers.length === 0) {
        this.logger.warn(
          'Nenhum usuário ativo com e-mail cadastrado foi encontrado para receber a newsletter.',
        );
        return newsletter;
      }

      this.logger.log(
        `Disparando Newsletter #${newsletter.id} ("${dto.subject}") para ${activeUsers.length} usuários ativos...`,
      );

      const initial =
        dto.initialMessage ||
        'Olá! Temos o prazer de compartilhar com você as últimas atualizações de recursos, novidades e alertas importantes do ecossistema InfoAPI.';
      const final =
        dto.finalMessage ||
        'Para dúvidas ou suporte com essas novidades, nossa equipe técnica está sempre disponível através do e-mail suporte@infobrasilsistemas.com.br ou pelo nosso suporte oficial.';

      // Envia em lote assíncrono para os usuários
      for (const u of activeUsers) {
        if (!u.email) continue;
        const personalizedHtml = this.generateHtml(
          u.user,
          dto.subject,
          initial,
          final,
          announcements,
        );
        this.emailService
          .sendEmail(u.email, dto.subject, personalizedHtml)
          .catch((err) =>
            this.logger.error(
              `Erro ao disparar newsletter para usuário ${u.user} (${u.email}): ${err.message}`,
            ),
          );
      }

      return newsletter;
    });
  }
}
