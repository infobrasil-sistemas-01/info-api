import { Test, TestingModule } from '@nestjs/testing';
import { ChangelogController } from './changelog.controller';
import { ChangelogService } from './changelog.service';
import { NotFoundException } from '@nestjs/common';

describe('ChangelogController', () => {
  let controller: ChangelogController;
  let mockService: {
    getAllReleases: jest.Mock;
    getReleaseByVersion: jest.Mock;
    getStats: jest.Mock;
  };

  const sampleRelease = {
    version: '1.16.22',
    date: '2026-09-07',
    title: 'Resiliência e Auto-recuperação de Serviços',
    summary: 'Introdução de mecanismo automático de auto-cura.',
    highlights: ['Auto-recuperação de containers'],
    items: [
      {
        module: 'Infraestrutura & Resiliência',
        type: 'fix' as const,
        title: 'Recuperação automática de serviços (Autoheal)',
        description: 'Mecanismo de auto-cura configurado.',
        impact: 'Maior tempo de atividade.',
        originalCommit: 'add willfarrell/autoheal to resilience',
        commitHash: 'cc8e283',
      },
    ],
    totalChanges: 1,
  };

  const sampleStats = {
    totalVersions: 1,
    currentVersion: '1.16.22',
    lastReleaseDate: '2026-09-07',
    totalFeatures: 0,
    totalFixes: 1,
    totalSecurities: 0,
  };

  beforeEach(async () => {
    mockService = {
      getAllReleases: jest.fn().mockReturnValue([sampleRelease]),
      getReleaseByVersion: jest.fn(),
      getStats: jest.fn().mockReturnValue(sampleStats),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChangelogController],
      providers: [
        {
          provide: ChangelogService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ChangelogController>(ChangelogController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getData', () => {
    it('deve retornar estatísticas e a lista de releases', async () => {
      const result = await controller.getData();

      expect(result).toHaveProperty('stats');
      expect(result).toHaveProperty('releases');
      expect(result.stats.totalVersions).toBe(1);
      expect(result.releases).toHaveLength(1);
      expect(result.releases[0].version).toBe('1.16.22');
      expect(mockService.getStats).toHaveBeenCalledTimes(1);
      expect(mockService.getAllReleases).toHaveBeenCalledTimes(1);
    });
  });

  describe('getVersionData', () => {
    it('deve retornar os detalhes de uma versão existente', async () => {
      mockService.getReleaseByVersion.mockReturnValue(sampleRelease);

      const result = await controller.getVersionData('1.16.22');

      expect(result).toEqual(sampleRelease);
      expect(mockService.getReleaseByVersion).toHaveBeenCalledWith('1.16.22');
    });

    it('deve lançar NotFoundException quando a versão não existir', async () => {
      mockService.getReleaseByVersion.mockReturnValue(null);

      await expect(controller.getVersionData('9.9.9')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockService.getReleaseByVersion).toHaveBeenCalledWith('9.9.9');
    });
  });

  describe('getChangelogPage', () => {
    it('deve servir o HTML da página ou responder com 404 se o arquivo não existir', async () => {
      const mockResponse: any = {
        type: jest.fn().mockReturnThis(),
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await controller.getChangelogPage(mockResponse);

      // Ou envia o template (send) ou se não encontrado manda status(404)
      expect(mockResponse.send).toHaveBeenCalled();
    });
  });
});
