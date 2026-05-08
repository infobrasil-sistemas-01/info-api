import { Injectable } from '@nestjs/common';
import { RegistryPrismaService } from 'src/infra/prisma/registry-prisma.service';

@Injectable()
export class AnnouncementService {
  constructor(private prisma: RegistryPrismaService) { }

  async findAllForUser(userId: string) {
    const now = new Date();

    return this.prisma.announcement.findMany({
      where: {
        active: true,
        OR: [
          { startDate: null, endDate: null },
          {
            startDate: { lte: now },
            endDate: { gte: now },
          },
          {
            startDate: { lte: now },
            endDate: null,
          },
          {
            startDate: null,
            endDate: { gte: now },
          },
        ],
        views: {
          none: {
            userId: userId,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async markAsViewed(userId: string, announcementId: string) {
    return this.prisma.announcementView.upsert({
      where: {
        announcementId_userId: {
          announcementId,
          userId,
        },
      },
      create: {
        announcementId,
        userId,
      },
      update: {},
    });
  }

  // Admin methods (can be expanded later)
  async create(data: any) {
    return this.prisma.announcement.create({ data });
  }
}
