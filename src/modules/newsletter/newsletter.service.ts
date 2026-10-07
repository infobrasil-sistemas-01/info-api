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

  private normalizeType(type?: string): 'STANDARD' | 'URGENT' {
    if (!type) return 'STANDARD';
    const upper = type.toUpperCase();
    return upper === 'URGENT' || upper === 'URGENTE' ? 'URGENT' : 'STANDARD';
  }

  private generateHtml(
    username: string,
    subject: string,
    initialMessage: string,
    finalMessage: string,
    announcements: any[],
    type: 'STANDARD' | 'URGENT' = 'STANDARD',
  ): string {
    const logoBase64 = this.getLogoBase64();
    const version = this.getApiVersion();
    const isUrgent = type === 'URGENT';

    const typeStyles: Record<
      string,
      { label: string; bg: string; border: string; text: string; icon: string }
    > = {
      INFO: {
        label: isUrgent ? 'Informativo Técnico' : 'Informativo',
        bg: isUrgent ? '#f8fafc' : '#ecfdf5',
        border: isUrgent ? '#94a3b8' : '#10b981',
        text: isUrgent ? '#334155' : '#047857',
        icon: 'ℹ️',
      },
      WARNING: {
        label: isUrgent ? 'Manutenção / Atenção' : 'Aviso',
        bg: '#fffbeb',
        border: '#f59e0b',
        text: '#b45309',
        icon: '⚠️',
      },
      ALERT: {
        label: isUrgent ? 'Indisponibilidade / Crítico' : 'Alerta',
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
        const ctaBtnBg = isUrgent ? '#dc2626' : '#10b981';
        const ctaHtml =
          ann.ctaLink && ann.ctaText
            ? `<div style="margin-top: 12px;">
                 <a href="${ann.ctaLink}" style="background: ${ctaBtnBg}; color: white; padding: 7px 14px; font-size: 0.85rem; font-weight: bold; text-decoration: none; border-radius: 6px; display: inline-block;">${ann.ctaText}</a>
               </div>`
            : '';

        const cardBorder =
          isUrgent && (ann.type === 'ALERT' || ann.type === 'WARNING')
            ? `border: 2px solid ${style.border}; border-left: 6px solid ${style.border};`
            : `border-left: 4px solid ${style.border};`;

        return `
        <div style="background: ${style.bg}; ${cardBorder} padding: 16px; border-radius: 4px 8px 8px 4px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="font-size: 1.15rem; line-height: 1;">${style.icon}</span>
            <span style="font-weight: 800; color: ${style.text}; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em;">${style.label}</span>
          </div>
          <div style="color: #1e293b; font-size: 0.95rem; line-height: 1.55; white-space: pre-wrap;">${ann.text}</div>
          ${ctaHtml}
        </div>`;
      })
      .join('');

    const urgentTopBanner = isUrgent
      ? `<tr>
           <td style="background-color: #dc2626; color: #ffffff; text-align: center; padding: 10px 16px; font-size: 0.82rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;">
             🚨 COMUNICADO DE URGÊNCIA &bull; ATENÇÃO OPERACIONAL REQUERIDA 🚨
           </td>
         </tr>`
      : '';

    const urgentNoticeBox = isUrgent
      ? `<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fef2f2; border: 2px solid #ef4444; border-radius: 8px; margin-bottom: 24px; border-collapse: separate;">
           <tr>
             <td style="padding: 16px 20px;">
               <div style="color: #991b1b; font-size: 0.95rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 6px;">
                 ⚠️ Aviso de Indisponibilidade / Manutenção Crítica
               </div>
               <div style="color: #7f1d1d; font-size: 0.9rem; line-height: 1.55;">
                 Este comunicado possui caráter prioritário. Caso este aviso informe janela de manutenção ou instabilidade, atente-se aos impactos potenciais em chamadas de API e sincronizações ativas.
               </div>
             </td>
           </tr>
         </table>`
      : '';

    const urgentActionBox = isUrgent
      ? `<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fff7ed; border-left: 4px solid #ea580c; border-radius: 0 8px 8px 0; margin-top: 24px; margin-bottom: 24px; border-collapse: separate;">
           <tr>
             <td style="padding: 16px 20px;">
               <div style="color: #9a3412; font-weight: 800; font-size: 0.88rem; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.03em;">
                 ⚡ Procedimentos &amp; Recomendações:
               </div>
               <ul style="margin: 0; padding-left: 18px; color: #7c2d12; font-size: 0.85rem; line-height: 1.55;">
                 <li>Valide os mecanismos de retry e tolerância a falhas nas suas integrações.</li>
                 <li>Suspenda temporariamente disparos em massa ou rotinas pesadas durante janelas programadas.</li>
                 <li>Acompanhe nosso status oficial e notifique seus times operacionais.</li>
               </ul>
             </td>
           </tr>
         </table>`
      : '';

    const headerBg = isUrgent
      ? 'background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 50%, #b91c1c 100%);'
      : 'background-color: #0f172a;';

    const headerBorder = isUrgent
      ? 'border-bottom: 3px solid #ef4444;'
      : 'border-bottom: 1px solid #1e293b;';

    const headerTag = isUrgent
      ? `<span style="background-color: #fee2e2; color: #991b1b; font-size: 0.75rem; font-weight: 800; padding: 4px 10px; border-radius: 9999px; border: 1px solid #f87171; letter-spacing: 0.05em; text-transform: uppercase;">ALERTA CRÍTICO</span>`
      : `<span style="background-color: rgba(16, 185, 129, 0.15); color: #34d399; font-size: 0.75rem; font-weight: bold; padding: 4px 10px; border-radius: 9999px; border: 1px solid rgba(16, 185, 129, 0.25);">v${version}</span>`;

    const greetingColor = isUrgent ? '#991b1b' : '#0f172a';
    const greetingText = isUrgent
      ? `Aos cuidados de ${username},`
      : `Olá, ${username}!`;

    const footerBg = isUrgent
      ? 'background-color: #fef2f2; border-top: 2px solid #fecaca;'
      : 'background-color: #f8fafc; border-top: 1px solid #e2e8f0;';
    const footerTitle = isUrgent
      ? 'InfoBrasil Sistemas &bull; Suporte Emergencial &amp; NOC'
      : 'InfoBrasil Sistemas';
    const footerTitleColor = isUrgent ? '#991b1b' : '#0f172a';
    const footerSubtitle = isUrgent
      ? 'Este é um comunicado oficial e prioritário de emergência técnica enviado para integradores e parceiros do ecossistema InfoAPI.'
      : 'Este é um e-mail automático enviado para desenvolvedores e parceiros integrados com o ecossistema InfoAPI.';
    const footerSubtitleColor = isUrgent ? '#b91c1c' : '#94a3b8';

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
              ${urgentTopBanner}
              <!-- Header -->
              <tr style="${headerBg}">
                <td style="padding: 24px; ${headerBorder}">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="left" valign="middle">
                        ${
                          logoBase64
                            ? `<img src="${logoBase64}" alt="InfoAPI" style="height: 32px; display: block;" />`
                            : `<span style="font-size: 1.5rem; font-weight: bold; color: #ffffff;">Info<span style="color: ${isUrgent ? '#fca5a5' : '#10b981'};">API</span></span>`
                        }
                      </td>
                      <td align="right" valign="middle">
                        ${headerTag}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 32px 24px;">
                  <h2 style="color: ${greetingColor}; font-size: 1.35rem; margin-top: 0; margin-bottom: 16px; font-weight: 700;">${greetingText}</h2>
                  
                  ${urgentNoticeBox}

                  <p style="color: #475569; font-size: 1rem; line-height: 1.6; margin-top: 0; margin-bottom: 24px;">
                    ${initialMessage}
                  </p>

                  <!-- Announcements Section -->
                  <div style="margin-bottom: 32px;">
                    ${annsHtml}
                  </div>

                  ${urgentActionBox}

                  <p style="color: #475569; font-size: 1rem; line-height: 1.6; margin-top: 0; margin-bottom: 0;">
                    ${finalMessage}
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr style="${footerBg}">
                <td style="padding: 24px; text-align: center;">
                  <p style="margin: 0; color: ${footerTitleColor}; font-weight: bold; font-size: 0.9rem;">${footerTitle}</p>
                  <p style="margin: 4px 0 0 0; color: ${footerSubtitleColor}; font-size: 0.8rem;">${footerSubtitle}</p>
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
  ): Promise<{ html: string; subject: string; nextId: number; type: string }> {
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

    const type = this.normalizeType(dto.type);
    const isUrgent = type === 'URGENT';

    const initial =
      dto.initialMessage ||
      (isUrgent
        ? '⚠️ COMUNICADO DE URGÊNCIA: Informamos sobre uma manutenção programada ou instabilidade temporária no ecossistema InfoAPI. Por favor, atente-se às orientações e impactos abaixo.'
        : 'Olá! Temos o prazer de compartilhar com você as últimas atualizações de recursos, novidades e alertas importantes do ecossistema InfoAPI.');

    const final =
      dto.finalMessage ||
      (isUrgent
        ? 'Nossa equipe de engenharia e infraestrutura está monitorando ativamente os serviços para minimizar qualquer impacto. Em caso de dúvidas urgentes, contate imediatamente nosso canal de suporte operacional.'
        : 'Para dúvidas ou suporte com essas novidades, nossa equipe técnica está sempre disponível através do e-mail suporte@infobrasilsistemas.com.br ou pelo nosso suporte oficial.');

    const html = this.generateHtml(
      '[Nome do Usuário]',
      dto.subject,
      initial,
      final,
      announcements,
      type,
    );
    return { html, subject: dto.subject, nextId, type };
  }

  async send(dto: SendNewsletterDto) {
    const type = this.normalizeType(dto.type);
    const isUrgent = type === 'URGENT';

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
        `Disparando Newsletter #${newsletter.id} [${type}] ("${dto.subject}") para ${activeUsers.length} usuários ativos...`,
      );

      const initial =
        dto.initialMessage ||
        (isUrgent
          ? '⚠️ COMUNICADO DE URGÊNCIA: Informamos sobre uma manutenção programada ou instabilidade temporária no ecossistema InfoAPI. Por favor, atente-se às orientações e impactos abaixo.'
          : 'Olá! Temos o prazer de compartilhar com você as últimas atualizações de recursos, novidades e alertas importantes do ecossistema InfoAPI.');

      const final =
        dto.finalMessage ||
        (isUrgent
          ? 'Nossa equipe de engenharia e infraestrutura está monitorando ativamente os serviços para minimizar qualquer impacto. Em caso de dúvidas urgentes, contate imediatamente nosso canal de suporte operacional.'
          : 'Para dúvidas ou suporte com essas novidades, nossa equipe técnica está sempre disponível através do e-mail suporte@infobrasilsistemas.com.br ou pelo nosso suporte oficial.');

      // Envia em lote assíncrono para os usuários
      for (const u of activeUsers) {
        if (!u.email) continue;
        const personalizedHtml = this.generateHtml(
          u.user,
          dto.subject,
          initial,
          final,
          announcements,
          type,
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
