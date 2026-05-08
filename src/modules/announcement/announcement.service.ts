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

  async findAll() {
    return this.prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { views: true }
        }
      }
    });
  }

  async findOne(id: string) {
    return this.prisma.announcement.findUnique({
      where: { id },
    });
  }

  async create(data: any) {
    return this.prisma.announcement.create({
      data: {
        ...data,
        active: data.active ?? true,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.announcement.update({
      where: { id },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.announcement.delete({
      where: { id },
    });
  }
}
