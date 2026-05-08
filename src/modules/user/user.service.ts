import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { RegistryPrismaService } from 'src/infra/prisma/registry-prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import * as argon2 from 'argon2';
import { randomUUID } from 'crypto';
import { generateApiPassword } from 'src/common/utils/password-generator.util';
import { EmailService } from 'src/infra/email/email.service';
import { EnvService } from 'src/config/env/env.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly prisma: RegistryPrismaService,
    private readonly emailService: EmailService,
    private readonly env: EnvService,
  ) { }

  async create(data: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { user: data.user },
    });

    if (existing) {
      throw new ConflictException('Usuário já existe');
    }

    const { password, ...userData } = data;
    let passwordHash = '';
    let hasInvitation = false;

    if (password) {
      passwordHash = await argon2.hash(password);
    } else {
      // Hash de fallback para campo não nulo
      passwordHash = 'AWAITING_SETUP';
      userData.status = false;
      hasInvitation = true;
    }

    const user = await this.prisma.user.create({
      data: {
        ...userData,
        passwordHash,
      },
      select: {
        id: true,
        user: true,
        email: true,
        status: true,
        roleId: true,
        dbCredentialsId: true,
        storeId: true,
        createdAt: true,
      },
    });

    if (hasInvitation && data.email) {
      const token = randomUUID();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      await this.prisma.userInvitation.create({
        data: {
          userId: user.id,
          token,
          expiresAt,
        }
      });

      await this.sendInvitationEmail(data.email, user.user, token);
    }

    return user;
  }

  public async sendInvitationEmail(to: string, username: string, token: string) {
    const baseUrl = this.env.get('NODE_ENV') === 'production'
      ? 'https://info-api.infobrasilsistemas.com.br'
      : `http://localhost:${this.env.get('PORT') || 3000}`;

    const setupUrl = `${baseUrl}/integration/setup-password/${token}`;

    const html = `
      <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px;">
        <h2 style="color: #059669; margin-top: 0;">Bem-vindo ao InfoAPI!</h2>
        <p>Olá, <strong>${username}</strong>.</p>
        <p>Você foi convidado para acessar o sistema de integração da InfoBrasil.</p>
        <p>Para gerar sua senha de acesso, clique no botão abaixo:</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${setupUrl}" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Gerar Minha Senha</a>
        </div>
        <p style="font-size: 0.85rem; color: #666;">Este link expira em 10 minutos por segurança e é válido para uma única utilização.</p>
        <p style="font-size: 0.85rem; color: #666;">Se o botão não funcionar, copie e cole o link abaixo no seu navegador:</p>
        <p style="font-size: 0.85rem; color: #059669; word-break: break-all;">${setupUrl}</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;">
        <p style="font-weight: bold; margin-bottom: 4px;">InfoBrasil Sistemas</p>
      </div>
    `;

    await this.emailService.sendEmail(to, 'Convite de Acesso - InfoAPI', html)
      .catch(err => this.logger.error(`Erro ao enviar convite para ${to}: ${err.message}`));
  }

  public async sendWelcomeEmail(to: string, username: string, permissions: string[]) {
    const baseUrl = this.env.get('NODE_ENV') === 'production'
      ? 'https://info-api.infobrasilsistemas.com.br'
      : `http://localhost:${this.env.get('PORT') || 3000}`;

    const clientUrl = `${baseUrl}/integration/client`;
    const docsUrl = `${baseUrl}/docs`;

    const permissionsHtml = permissions.length > 0
      ? `<ul style="padding-left: 20px; color: #475569; font-size: 0.9rem;">
          ${permissions.map(p => `<li style="margin-bottom: 4px;">${p}</li>`).join('')}
         </ul>`
      : '<p style="color: #666; font-size: 0.9rem;">Nenhuma permissão específica atribuída.</p>';

    const html = `
      <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; background: #fff;">
        <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #059669; margin: 0;">Boas-vindas ao InfoAPI!</h1>
            <p style="color: #64748b;">Sua conta foi configurada com sucesso.</p>
        </div>
        
        <p>Olá, <strong>${username}</strong>!</p>
        <p>É um prazer ter você conosco. Sua senha de acesso foi gerada e agora você já pode utilizar todos os recursos da nossa API.</p>
        
        <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <h3 style="margin-top: 0; color: #0f172a; font-size: 1rem;">Seus Acessos Rápidos:</h3>
            <div style="display: flex; flex-direction: column; gap: 12px;">
                <a href="${clientUrl}" style="color: #059669; text-decoration: none; font-weight: 600;">➔ Acessar Painel do Cliente</a>
                <a href="${docsUrl}" style="color: #059669; text-decoration: none; font-weight: 600;">➔ Ver Documentação Técnica (Swagger)</a>
            </div>
        </div>

        <h3 style="color: #0f172a; font-size: 1rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">O que você pode fazer:</h3>
        <p style="font-size: 0.9rem; color: #64748b;">Com base no seu perfil de acesso, você tem as seguintes permissões:</p>
        ${permissionsHtml}

        <div style="margin-top: 32px; padding: 16px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px;">
            <p style="margin: 0; font-size: 0.85rem; color: #92400e;">
                <strong>Dica de Segurança:</strong> Nunca compartilhe sua senha. Caso precise de uma nova credencial, você pode rotacioná-la a qualquer momento no Painel do Cliente.
            </p>
        </div>

        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;">
        <p style="font-weight: bold; margin-bottom: 4px;">Equipe InfoBrasil Sistemas</p>
        <p style="font-size: 0.8rem; color: #94a3b8; margin-top: 0;">Este é um e-mail automático, por favor não responda.</p>
      </div>
    `;

    await this.emailService.sendEmail(to, 'Bem-vindo ao InfoAPI - Sua conta está pronta!', html)
      .catch(err => this.logger.error(`Erro ao enviar e-mail de boas-vindas para ${to}: ${err.message}`));
  }

  async setupPasswordByToken(token: string) {
    const invitation = await this.prisma.userInvitation.findUnique({
      where: { token },
      include: {
        user: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!invitation || invitation.acceptedAt || invitation.expiresAt < new Date()) {
      throw new NotFoundException('Convite inválido, expirado ou já utilizado.');
    }

    const plainPassword = generateApiPassword();
    const passwordHash = await argon2.hash(plainPassword);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: invitation.userId },
        data: {
          passwordHash,
          status: true,
        },
      }),
      this.prisma.userInvitation.update({
        where: { id: invitation.id },
        data: { acceptedAt: new Date() }
      })
    ]);

    // Enviar e-mail de boas-vindas
    if (invitation.user.email) {
      const perms = invitation.user.role?.rolePermissions.map(rp => rp.permission.name) || [];
      await this.sendWelcomeEmail(invitation.user.email, invitation.user.user, perms);
    }

    return {
      username: invitation.user.user,
      password: plainPassword,
    };
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        user: true,
        email: true,
        status: true,
        roleId: true,
        role: { select: { name: true } },
        dbCredentialsId: true,
        storeId: true,
        createdAt: true,
        planId: true,
        plan: { select: { name: true } },
        invitation: true,
      },
      orderBy: { user: 'asc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        user: true,
        status: true,
        roleId: true,
        role: { select: { name: true } },
        dbCredentialsId: true,
        storeId: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async update(id: string, data: UpdateUserDto) {
    const { password, ...userData } = data;

    const updateData: any = { ...userData };

    if (password) {
      updateData.passwordHash = await argon2.hash(password);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        user: true,
        status: true,
        roleId: true,
        createdAt: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async rotatePassword(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const plainPassword = generateApiPassword();
    const passwordHash = await argon2.hash(plainPassword);

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    this.logger.log(`Credenciais rotacionadas para o usuário: ${user.user}`);

    return {
      password: plainPassword,
    };
  }
}
