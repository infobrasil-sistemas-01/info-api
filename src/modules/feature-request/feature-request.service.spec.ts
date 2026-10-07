import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
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
      featureRequestMessage: {
        create: jest.fn(),
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

    it('should create feature request, expose ticketNumber and send email to support', async () => {
      const user = {
        id: 'user-1',
        user: 'empresa_teste',
        email: 'empresa@teste.com',
      };
      const createdRecord = {
        id: '12345678-abcd-ef01-2345-6789abcdef01',
        userId: 'user-1',
        requestText: 'Gostaria de um novo relatório de vendas',
        status: 'PENDING',
        user,
        messages: [],
      };

      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.featureRequest.create.mockResolvedValue(createdRecord);

      const result = await service.create('user-1', {
        requestText: 'Gostaria de um novo relatório de vendas',
      });

      expect(result).toEqual({
        ...createdRecord,
        ticketNumber: '#12345678',
      });
      expect(mockEmailService.sendToSupport).toHaveBeenCalledWith(
        expect.stringContaining('#12345678'),
        expect.stringContaining('empresa_teste'),
      );
    });
  });

  describe('addMessage', () => {
    it('should throw NotFoundException if request does not exist', async () => {
      mockPrisma.featureRequest.findUnique.mockResolvedValue(null);

      await expect(
        service.addMessage('non-existent-id', 'user-1', {
          message: 'Olá, alguma novidade?',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if ticket is already RESOLVED', async () => {
      mockPrisma.featureRequest.findUnique.mockResolvedValue({
        id: 'fr-1',
        userId: 'user-1',
        status: 'RESOLVED',
      });

      await expect(
        service.addMessage('fr-1', 'user-1', {
          message: 'Tentativa de mensagem em ticket fechado',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should allow client to add message, set status to PENDING and notify support', async () => {
      const request = {
        id: '12345678-0000-0000-0000-000000000000',
        userId: 'client-1',
        status: 'ANSWERED',
        user: { user: 'cliente_1', email: 'cliente@teste.com' },
      };
      const clientSender = {
        id: 'client-1',
        role: { name: 'Client' },
      };
      const createdMessage = {
        id: 'msg-1',
        featureRequestId: request.id,
        senderId: 'client-1',
        message: 'Ainda restou uma dúvida sobre o endpoint.',
      };

      mockPrisma.featureRequest.findUnique.mockResolvedValue(request);
      mockPrisma.user.findUnique.mockResolvedValue(clientSender);
      mockPrisma.featureRequestMessage.create.mockResolvedValue(createdMessage);
      mockPrisma.featureRequest.update.mockResolvedValue({
        ...request,
        status: 'PENDING',
      });

      const result = await service.addMessage(request.id, 'client-1', {
        message: 'Ainda restou uma dúvida sobre o endpoint.',
      });

      expect(result).toEqual(createdMessage);
      expect(mockPrisma.featureRequest.update).toHaveBeenCalledWith({
        where: { id: request.id },
        data: expect.objectContaining({ status: 'PENDING' }),
      });
      expect(mockEmailService.sendToSupport).toHaveBeenCalledWith(
        expect.stringContaining('#12345678'),
        expect.stringContaining('Ainda restou uma dúvida'),
      );
    });

    it('should allow admin to add message, set status to ANSWERED and notify client', async () => {
      const request = {
        id: '87654321-0000-0000-0000-000000000000',
        userId: 'client-1',
        status: 'PENDING',
        user: { user: 'cliente_1', email: 'cliente@teste.com' },
      };
      const adminSender = {
        id: 'admin-1',
        role: { name: 'Admin' },
      };
      const createdMessage = {
        id: 'msg-2',
        featureRequestId: request.id,
        senderId: 'admin-1',
        message: 'Estamos analisando a solicitação!',
      };

      mockPrisma.featureRequest.findUnique.mockResolvedValue(request);
      mockPrisma.user.findUnique.mockResolvedValue(adminSender);
      mockPrisma.featureRequestMessage.create.mockResolvedValue(createdMessage);
      mockPrisma.featureRequest.update.mockResolvedValue({
        ...request,
        status: 'ANSWERED',
      });

      const result = await service.addMessage(request.id, 'admin-1', {
        message: 'Estamos analisando a solicitação!',
      });

      expect(result).toEqual(createdMessage);
      expect(mockPrisma.featureRequest.update).toHaveBeenCalledWith({
        where: { id: request.id },
        data: expect.objectContaining({ status: 'ANSWERED' }),
      });
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        'cliente@teste.com',
        expect.stringContaining('#87654321'),
        expect.stringContaining('Estamos analisando a solicitação!'),
      );
    });
  });

  describe('resolve', () => {
    it('should mark ticket as RESOLVED, set resolvedAt and notify client', async () => {
      const request = {
        id: '99998888-0000-0000-0000-000000000000',
        userId: 'client-1',
        status: 'ANSWERED',
        user: { user: 'cliente_1', email: 'cliente@teste.com' },
      };
      const updated = {
        ...request,
        status: 'RESOLVED',
        resolvedAt: new Date(),
        messages: [],
      };

      mockPrisma.featureRequest.findUnique.mockResolvedValue(request);
      mockPrisma.featureRequest.update.mockResolvedValue(updated);

      const result = await service.resolve(request.id, 'admin-1', {
        closingMessage: 'Entrega finalizada com sucesso.',
      });

      expect(result.status).toBe('RESOLVED');
      expect(result.ticketNumber).toBe('#99998888');
      expect(mockPrisma.featureRequestMessage.create).toHaveBeenCalledWith({
        data: {
          featureRequestId: request.id,
          senderId: 'admin-1',
          message: 'Entrega finalizada com sucesso.',
        },
      });
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        'cliente@teste.com',
        expect.stringContaining('#99998888'),
        expect.stringContaining('Entrega finalizada com sucesso'),
      );
    });
  });
});
