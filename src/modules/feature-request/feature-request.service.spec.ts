import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FeatureRequestService } from './feature-request.service';
import { RegistryPrismaService } from 'src/infra/prisma/registry-prisma.service';
import { EmailService } from 'src/infra/email/email.service';

describe('FeatureRequestService', () => {
  let service: FeatureRequestService;
  let mockPrisma: any;
  let mockEmailService: any;

  beforeEach(async () => {
    mockPrisma = {
      user: {
        findUnique: jest.fn(),
      },
      featureRequest: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    mockEmailService = {
      sendToSupport: jest.fn().mockResolvedValue({}),
      sendEmail: jest.fn().mockResolvedValue({}),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeatureRequestService,
        { provide: RegistryPrismaService, useValue: mockPrisma },
        { provide: EmailService, useValue: mockEmailService },
      ],
    }).compile();

    service = module.get<FeatureRequestService>(FeatureRequestService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should throw NotFoundException if user does not exist', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.create('non-existent-user', {
          requestText: 'Gostaria de um novo relatório de vendas',
        }),
      ).rejects.toThrow(NotFoundException);

      expect(mockPrisma.featureRequest.create).not.toHaveBeenCalled();
    });

    it('should create feature request and send email to support', async () => {
      const user = {
        id: 'user-1',
        user: 'empresa_teste',
        email: 'empresa@teste.com',
      };
      const createdRecord = {
        id: 'fr-1',
        userId: 'user-1',
        requestText: 'Gostaria de um novo relatório de vendas',
        status: 'PENDING',
        user,
      };

      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.featureRequest.create.mockResolvedValue(createdRecord);

      const result = await service.create('user-1', {
        requestText: 'Gostaria de um novo relatório de vendas',
      });

      expect(result).toEqual(createdRecord);
      expect(mockPrisma.featureRequest.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          requestText: 'Gostaria de um novo relatório de vendas',
          status: 'PENDING',
        },
        include: {
          user: {
            select: { id: true, user: true, email: true },
          },
        },
      });
      expect(mockEmailService.sendToSupport).toHaveBeenCalledWith(
        expect.stringContaining('empresa_teste'),
        expect.stringContaining('Gostaria de um novo relatório'),
      );
    });

    it('should not throw if email service fails on create', async () => {
      const user = {
        id: 'user-1',
        user: 'empresa_teste',
        email: 'empresa@teste.com',
      };
      const createdRecord = {
        id: 'fr-1',
        userId: 'user-1',
        requestText: 'Gostaria de um novo relatório de vendas',
        status: 'PENDING',
        user,
      };

      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.featureRequest.create.mockResolvedValue(createdRecord);
      mockEmailService.sendToSupport.mockRejectedValue(new Error('SMTP Offline'));

      const result = await service.create('user-1', {
        requestText: 'Gostaria de um novo relatório de vendas',
      });

      expect(result).toEqual(createdRecord);
    });
  });

  describe('findAll', () => {
    it('should return all feature requests without filter', async () => {
      const list = [{ id: '1' }, { id: '2' }];
      mockPrisma.featureRequest.findMany.mockResolvedValue(list);

      const result = await service.findAll();
      expect(result).toEqual(list);
      expect(mockPrisma.featureRequest.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, user: true, email: true },
          },
        },
      });
    });

    it('should filter by status when provided', async () => {
      mockPrisma.featureRequest.findMany.mockResolvedValue([]);

      await service.findAll('PENDING');
      expect(mockPrisma.featureRequest.findMany).toHaveBeenCalledWith({
        where: { status: 'PENDING' },
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, user: true, email: true },
          },
        },
      });
    });
  });

  describe('findByUser', () => {
    it('should return requests for a specific user', async () => {
      const userList = [{ id: '1', userId: 'user-1' }];
      mockPrisma.featureRequest.findMany.mockResolvedValue(userList);

      const result = await service.findByUser('user-1');
      expect(result).toEqual(userList);
      expect(mockPrisma.featureRequest.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('respond', () => {
    it('should throw NotFoundException if feature request does not exist', async () => {
      mockPrisma.featureRequest.findUnique.mockResolvedValue(null);

      await expect(
        service.respond('non-existent-id', {
          responseText: 'Resposta de teste',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update request with response and notify user by email', async () => {
      const existing = {
        id: 'fr-1',
        userId: 'user-1',
        requestText: 'Texto original',
        user: { user: 'cliente_1', email: 'cliente@teste.com' },
      };
      const updated = {
        ...existing,
        responseText: 'Resposta oficial',
        status: 'ANSWERED',
        answeredAt: new Date(),
      };

      mockPrisma.featureRequest.findUnique.mockResolvedValue(existing);
      mockPrisma.featureRequest.update.mockResolvedValue(updated);

      const result = await service.respond('fr-1', {
        responseText: 'Resposta oficial',
      });

      expect(result).toEqual(updated);
      expect(mockPrisma.featureRequest.update).toHaveBeenCalledWith({
        where: { id: 'fr-1' },
        data: {
          responseText: 'Resposta oficial',
          status: 'ANSWERED',
          answeredAt: expect.any(Date),
        },
        include: {
          user: {
            select: { id: true, user: true, email: true },
          },
        },
      });
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        'cliente@teste.com',
        expect.stringContaining('Atualização sobre sua Solicitação'),
        expect.stringContaining('Resposta oficial'),
      );
    });
  });
});
