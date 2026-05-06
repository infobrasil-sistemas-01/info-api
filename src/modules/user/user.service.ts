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
  ) {}

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
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);

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

  async setupPasswordByToken(token: string) {
    const invitation = await this.prisma.userInvitation.findUnique({
      where: { token },
      include: { user: true }
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
}
