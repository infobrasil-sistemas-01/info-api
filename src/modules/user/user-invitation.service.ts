import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { RegistryPrismaService } from 'src/infra/prisma/registry-prisma.service';
import { UserService } from './user.service';
import { randomUUID } from 'crypto';

@Injectable()
export class UserInvitationService {
  constructor(
    private readonly prisma: RegistryPrismaService,
    private readonly userService: UserService,
  ) {}

  async findAll() {
    return this.prisma.userInvitation.findMany({
      include: {
        user: {
          select: {
            user: true,
            email: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async revoke(id: string) {
    const invite = await this.prisma.userInvitation.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!invite) return;

    return this.prisma.user.delete({
      where: { id: invite.userId },
    });
  }

  async resend(id: string) {
    const invite = await this.prisma.userInvitation.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!invite) {
      throw new NotFoundException('Convite não encontrado');
    }

    if (invite.acceptedAt) {
      throw new BadRequestException('Este convite já foi aceito e não pode ser reenviado.');
    }

    const newToken = randomUUID();
    const newExpiresAt = new Date();
    newExpiresAt.setMinutes(newExpiresAt.getMinutes() + 10);

    const updatedInvite = await this.prisma.userInvitation.update({
      where: { id },
      data: {
        token: newToken,
        expiresAt: newExpiresAt,
        createdAt: new Date(), // Reinicia o contador de criação para exibição
      }
    });

    if (invite.user.email) {
      await this.userService.sendInvitationEmail(
        invite.user.email,
        invite.user.user,
        newToken
      );
    }

    return updatedInvite;
  }
}
