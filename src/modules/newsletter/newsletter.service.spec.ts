import { Test, TestingModule } from '@nestjs/testing';
import { NewsletterService } from './newsletter.service';
import { RegistryPrismaService } from 'src/infra/prisma/registry-prisma.service';
import { EmailService } from 'src/infra/email/email.service';
import { BadRequestException } from '@nestjs/common';

describe('NewsletterService', () => {
  let service: NewsletterService;
  let mockPrisma: any;
  let mockEmailService: any;

  beforeEach(async () => {
    mockPrisma = {
      newsletter: {
        findMany: jest.fn(),
        create: jest.fn(),
      },
      announcement: {
        findMany: jest.fn(),
        updateMany: jest.fn(),
      },
      user: {
        findMany: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    mockEmailService = {
      sendEmail: jest.fn().mockResolvedValue({}),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewsletterService,
        { provide: RegistryPrismaService, useValue: mockPrisma },
        { provide: EmailService, useValue: mockEmailService },
      ],
    }).compile();

    service = module.get<NewsletterService>(NewsletterService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getNextId', () => {
    it('should return 1 when no newsletters exist', async () => {
      mockPrisma.newsletter.findMany.mockResolvedValue([]);
      const result = await service.getNextId();
      expect(result).toEqual(1);
    });

    it('should return last ID + 1 when newsletters exist', async () => {
      mockPrisma.newsletter.findMany.mockResolvedValue([{ id: 5 }]);
      const result = await service.getNextId();
      expect(result).toEqual(6);
    });
  });

  describe('getPreview', () => {
    it('should throw BadRequestException if announcements list is empty', async () => {
      mockPrisma.newsletter.findMany.mockResolvedValue([]);
      mockPrisma.announcement.findMany.mockResolvedValue([]);

      await expect(
        service.getPreview({
          announcementIds: ['47ef5c20-7f2a-4db3-9824-2c6c39bb7f1a'],
          subject: 'Test News',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should return a beautiful HTML preview structure', async () => {
      mockPrisma.newsletter.findMany.mockResolvedValue([{ id: 2 }]);
      mockPrisma.announcement.findMany.mockResolvedValue([
        {
          id: '47ef5c20-7f2a-4db3-9824-2c6c39bb7f1a',
          type: 'INFO',
          text: 'New update text',
          ctaText: 'Check details',
          ctaLink: 'https://example.com',
          createdAt: new Date(),
        },
      ]);

      const result = await service.getPreview({
        announcementIds: ['47ef5c20-7f2a-4db3-9824-2c6c39bb7f1a'],
        subject: 'InfoAPI News #3',
      });

      expect(result.subject).toEqual('InfoAPI News #3');
      expect(result.nextId).toEqual(3);
      expect(result.html).toContain('Info');
      expect(result.html).toContain('New update text');
      expect(result.html).toContain('Check details');
    });

    it('should generate an urgent template when type is URGENT or URGENTE', async () => {
      mockPrisma.newsletter.findMany.mockResolvedValue([{ id: 4 }]);
      mockPrisma.announcement.findMany.mockResolvedValue([
        {
          id: '47ef5c20-7f2a-4db3-9824-2c6c39bb7f1a',
          type: 'ALERT',
          text: 'Instabilidade detectada no módulo de pagamentos.',
          ctaText: 'Verificar Status',
          ctaLink: 'https://status.infobrasil.com.br',
          createdAt: new Date(),
        },
      ]);

      const result = await service.getPreview({
        announcementIds: ['47ef5c20-7f2a-4db3-9824-2c6c39bb7f1a'],
        subject: '[URGENTE] InfoAPI - Instabilidade Temporária',
        type: 'URGENT',
      });

      expect(result.subject).toEqual('[URGENTE] InfoAPI - Instabilidade Temporária');
      expect(result.type).toEqual('URGENT');
      expect(result.html).toContain('COMUNICADO DE URGÊNCIA');
      expect(result.html).toContain('ALERTA CRÍTICO');
      expect(result.html).toContain('Instabilidade detectada no módulo de pagamentos.');
      expect(result.html).toContain('Procedimentos &amp; Recomendações');
    });
  });

  describe('send', () => {
    it('should fail if announcement is already sent', async () => {
      mockPrisma.announcement.findMany.mockResolvedValue([
        { id: '47ef5c20-7f2a-4db3-9824-2c6c39bb7f1a', newsletterId: 4 },
      ]);

      await expect(
        service.send({
          announcementIds: ['47ef5c20-7f2a-4db3-9824-2c6c39bb7f1a'],
          subject: 'Newsletter #5',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should send newsletters and update announcements inside a transaction', async () => {
      const mockAnnouncements = [
        { id: '47ef5c20-7f2a-4db3-9824-2c6c39bb7f1a', newsletterId: null },
      ];
      mockPrisma.announcement.findMany.mockResolvedValue(mockAnnouncements);

      const mockNewsletter = { id: 1, subject: 'Newsletter #1' };

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const txMock = {
          newsletter: {
            create: jest.fn().mockResolvedValue(mockNewsletter),
          },
          announcement: {
            updateMany: jest.fn().mockResolvedValue({ count: 1 }),
          },
          user: {
            findMany: jest
              .fn()
              .mockResolvedValue([
                { user: 'Gabriel', email: 'gabriel@example.com' },
              ]),
          },
        };
        return callback(txMock);
      });

      const result = await service.send({
        announcementIds: ['47ef5c20-7f2a-4db3-9824-2c6c39bb7f1a'],
        subject: 'Newsletter #1',
      });

      expect(result).toEqual(mockNewsletter);
      expect(mockPrisma.$transaction).toHaveBeenCalled();
    });

    it('should send urgent newsletter with urgent email body and subject', async () => {
      const mockAnnouncements = [
        {
          id: '47ef5c20-7f2a-4db3-9824-2c6c39bb7f1a',
          type: 'ALERT',
          text: 'Manutenção emergencial nos servidores.',
          newsletterId: null,
        },
      ];
      mockPrisma.announcement.findMany.mockResolvedValue(mockAnnouncements);

      const mockNewsletter = {
        id: 2,
        subject: '[URGENTE] Manutenção Programada',
      };

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const txMock = {
          newsletter: {
            create: jest.fn().mockResolvedValue(mockNewsletter),
          },
          announcement: {
            updateMany: jest.fn().mockResolvedValue({ count: 1 }),
          },
          user: {
            findMany: jest
              .fn()
              .mockResolvedValue([
                { user: 'Admin', email: 'admin@empresa.com' },
              ]),
          },
        };
        return callback(txMock);
      });

      const result = await service.send({
        announcementIds: ['47ef5c20-7f2a-4db3-9824-2c6c39bb7f1a'],
        subject: '[URGENTE] Manutenção Programada',
        type: 'URGENT',
      });

      expect(result).toEqual(mockNewsletter);
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        'admin@empresa.com',
        '[URGENTE] Manutenção Programada',
        expect.stringContaining('COMUNICADO DE URGÊNCIA'),
      );
    });
  });
});

