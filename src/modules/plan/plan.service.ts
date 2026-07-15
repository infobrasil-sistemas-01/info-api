import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { RegistryPrismaService } from 'src/infra/prisma/registry-prisma.service';
import { EmailService } from 'src/infra/email/email.service';
import { EnvService } from 'src/config/env/env.service';
import * as fs from 'fs';
import * as path from 'path';

export interface PlanLimits {
  name: string;
  reqMin: number;
  reqMonth: number;
  maxPageSize: number;
  maxDateRangeDays: number;
}

@Injectable()
export class PlanService {
  private readonly logger = new Logger(PlanService.name);

  // Limites padrão do plano Free (conforme imagem)
  private readonly DEFAULT_FREE_LIMITS: PlanLimits = {
    name: 'Free',
    reqMin: 30,
    reqMonth: 10000,
    maxPageSize: 100,
    maxDateRangeDays: 7,
  };

  constructor(
    private readonly prisma: RegistryPrismaService,
    private readonly emailService: EmailService,
    private readonly env: EnvService,
  ) {}

  async getUserLimits(userId: string): Promise<PlanLimits> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { plan: true },
    });

    if (!user || !user.plan) {
      return this.DEFAULT_FREE_LIMITS;
    }

    return {
      name: user.plan.name,
      reqMin: user.plan.reqMin,
      reqMonth: user.plan.reqMonth,
      maxPageSize: user.plan.maxPageSize,
      maxDateRangeDays: user.plan.maxDateRangeDays,
    };
  }

  async logRequest(
    userId: string,
    method: string,
    path: string,
    status: number,
    ip?: string,
    durationMs?: number,
    success?: boolean,
  ) {
    const isSuccess = success !== undefined ? success : status < 400;
    await this.prisma.requestLog.create({
      data: {
        userId,
        method,
        path,
        status,
        ip,
        durationMs,
        success: isSuccess,
      },
    });

    // Dispara a verificação de alerta de uso de forma assíncrona se a requisição foi um sucesso
    if (isSuccess) {
      this.checkAndSendUsageAlert(userId).catch((err) => {
        this.logger.error(
          `Falha ao processar verificação de alerta de uso para o usuário ${userId}: ${err.message}`,
        );
      });
    }
  }

  async getRequestCount(
    userId: string,
    timeframe: 'minute' | 'month',
  ): Promise<number> {
    const now = new Date();
    let startDate: Date;

    if (timeframe === 'minute') {
      startDate = new Date(now.getTime() - 60 * 1000);
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return this.prisma.requestLog.count({
      where: {
        userId,
        createdAt: { gte: startDate },
        status: { not: 429 },
      },
    });
  }

  async getUserStats(userId: string) {
    const limits = await this.getUserLimits(userId);
    const reqsMinute = await this.getRequestCount(userId, 'minute');
    const reqsMonth = await this.getRequestCount(userId, 'month');

    return {
      limits,
      usage: {
        reqsMinute,
        reqsMonth,
        minutePercentage: Math.min(100, (reqsMinute / limits.reqMin) * 100),
        monthPercentage: Math.min(100, (reqsMonth / limits.reqMonth) * 100),
      },
    };
  }

  private async checkAndSendUsageAlert(userId: string): Promise<void> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { plan: true },
      });

      if (!user || !user.email) {
        return;
      }

      const limits = user.plan || this.DEFAULT_FREE_LIMITS;
      const reqsMonth = await this.getRequestCount(userId, 'month');
      const limit = limits.reqMonth;

      // Se atingir pelo menos 80% do limite mensal
      if (reqsMonth >= limit * 0.8) {
        const alreadySent = await this.hasSentUsageAlertThisMonth(userId);
        if (alreadySent) {
          return;
        }

        const html = this.generateUsageAlertHtml(user.user, reqsMonth, limit);
        const subject = 'Alerta de Uso: Limite de Requisições Mensais Atingido em 80%';
        await this.emailService.sendEmail(user.email, subject, html);

        await this.markUsageAlertSent(userId);
      }
    } catch (e: any) {
      this.logger.error(
        `Erro ao verificar ou enviar alerta de limite de uso para o usuário ${userId}: ${e.message}`,
      );
    }
  }

  async sendManualUsageAlert(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { plan: true },
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    if (!user.email) {
      throw new BadRequestException('O usuário não possui e-mail cadastrado');
    }

    const limits = user.plan || this.DEFAULT_FREE_LIMITS;
    const reqsMonth = await this.getRequestCount(userId, 'month');
    const limit = limits.reqMonth;

    const html = this.generateUsageAlertHtml(user.user, reqsMonth, limit);
    const subject = 'Alerta de Uso: Limite de Requisições Mensais Atingido em 80%';
    
    await this.emailService.sendEmail(user.email, subject, html);
    await this.markUsageAlertSent(userId);
  }

  private async hasSentUsageAlertThisMonth(userId: string): Promise<boolean> {
    try {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const alertLog = await this.prisma.usageAlertLog.findFirst({
        where: {
          userId,
          alertType: 'MONTHLY_80',
          sentAt: {
            gte: firstDayOfMonth,
          },
        },
      });

      return alertLog !== null;
    } catch (e: any) {
      this.logger.error(`Erro ao verificar registro de alerta de uso: ${e.message}`);
      return false;
    }
  }

  private async markUsageAlertSent(userId: string): Promise<void> {
    try {
      await this.prisma.usageAlertLog.create({
        data: {
          userId,
          alertType: 'MONTHLY_80',
        },
      });
      this.logger.log(`Alerta de uso de 80% mensal registrado no banco para o usuário ${userId}`);
    } catch (e: any) {
      this.logger.error(`Erro ao salvar registro de alerta de uso no banco: ${e.message}`);
    }
  }

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

  private generateUsageAlertHtml(
    username: string,
    currentUsage: number,
    limit: number,
  ): string {
    const logoBase64 = this.getLogoBase64();
    const version = this.getApiVersion();
    const percentage = Math.round((currentUsage / limit) * 100);

    const host = this.env.get('HOST') || 'localhost';
    const port = this.env.get('PORT') || '3000';
    const protocol = host === 'localhost' ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}${port === '80' || port === '443' || !port ? '' : `:${port}`}`;

    return `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Alerta de Limite de Uso - InfoAPI</title>
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
                    Identificamos que a sua integração atingiu <strong>${percentage}%</strong> do limite mensal de requisições do seu plano atual.
                  </p>

                  <!-- Box Alerta de Uso -->
                  <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 0 8px 8px 0; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                      <span style="font-size: 1.1rem; line-height: 1;">⚠️</span>
                      <span style="font-weight: bold; color: #b45309; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em;">Aviso de Limite</span>
                    </div>
                    <div style="color: #1e293b; font-size: 0.95rem; line-height: 1.5;">
                      Você utilizou <strong>${currentUsage.toLocaleString('pt-BR')}</strong> de um total de <strong>${limit.toLocaleString('pt-BR')}</strong> requisições mensais disponíveis.
                    </div>
                  </div>

                  <p style="color: #475569; font-size: 1rem; line-height: 1.6; margin-top: 0; margin-bottom: 20px;">
                    Para garantir que seu serviço não sofra interrupções automáticas ao atingir 100% de uso, sugerimos duas ações:
                  </p>

                  <ul style="color: #475569; font-size: 0.95rem; line-height: 1.6; margin-top: 0; margin-bottom: 24px; padding-left: 20px;">
                    <li style="margin-bottom: 12px;">
                      <strong>Otimize suas Consultas:</strong> Recomendamos fortemente a leitura da nossa documentação sobre a aplicação de filtros eficientes (como limites, paginação e ranges de data apropriados). Isso reduz o volume de dados trafegados e evita chamadas redundantes.
                      <div style="margin-top: 8px;">
                        <a href="${baseUrl}/docs" style="background: #10b981; color: white; padding: 6px 12px; font-size: 0.8rem; font-weight: bold; text-decoration: none; border-radius: 6px; display: inline-block;">Ler Documentação de Filtros</a>
                      </div>
                    </li>
                    <li>
                      <strong>Upgrade de Plano:</strong> Se o seu volume de requisições cresceu de forma orgânica, considere migrar para um plano que atenda melhor a sua demanda atual.
                      <div style="margin-top: 8px;">
                        <a href="${baseUrl}/integration" style="background: #0f172a; color: white; padding: 6px 12px; font-size: 0.8rem; font-weight: bold; text-decoration: none; border-radius: 6px; display: inline-block;">Ver Planos de Integração</a>
                      </div>
                    </li>
                  </ul>

                  <p style="color: #475569; font-size: 1rem; line-height: 1.6; margin-top: 0; margin-bottom: 0;">
                    Em caso de dúvidas técnicas, nosso time está à disposição através do e-mail <a href="mailto:suporte@infobrasilsistemas.com.br" style="color: #10b981; text-decoration: none; font-weight: bold;">suporte@infobrasilsistemas.com.br</a>.
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
    </html>\n`;
  }
}
