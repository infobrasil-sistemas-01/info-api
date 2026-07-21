import { Test, TestingModule } from '@nestjs/testing';
import { DossierPdfService } from './dossier-pdf.service';

jest.mock('puppeteer', () => {
  const mockPage = {
    setContent: jest.fn(),
    evaluateHandle: jest.fn(),
    pdf: jest.fn().mockResolvedValue(Buffer.from('pdf-data')),
  };
  const mockBrowser = {
    newPage: jest.fn().mockResolvedValue(mockPage),
    close: jest.fn(),
  };
  return {
    launch: jest.fn().mockResolvedValue(mockBrowser),
  };
});

describe('DossierPdfService', () => {
  let service: DossierPdfService;
  let mockPuppeteer: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DossierPdfService],
    }).compile();

    service = module.get<DossierPdfService>(DossierPdfService);
    mockPuppeteer = require('puppeteer');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateDossierPdf', () => {
    it('should launch puppeteer, set page content, generate PDF and close browser', async () => {
      const data = {
        user: {
          username: 'test-user',
          monthlyRequests: 50000,
          planReqMonth: 100000,
        },
        summary: {
          totalRequests: 10000,
          successRate: 100,
          p95Latency: 15,
          rateLimitHits: 0,
          currentRpm: 15,
          averageRpm: 5.5,
        },
        timeSeries: [
          { timestamp: '2026-07-01', count: 10, success: 10, error: 0 },
        ],
        statusDistribution: [{ statusClass: '2xx', count: 10 }],
        topEndpoints: [],
      };

      const result = await service.generateDossierPdf(
        'client',
        data,
        new Date('2026-07-01T11:00:00Z'),
        new Date('2026-07-02T21:30:00Z'),
      );

      expect(result).toEqual(Buffer.from('pdf-data'));
      expect(mockPuppeteer.launch).toHaveBeenCalled();

      const mockBrowser = await mockPuppeteer.launch.mock.results[0].value;
      expect(mockBrowser.newPage).toHaveBeenCalled();

      const mockPage = await mockBrowser.newPage.mock.results[0].value;
      expect(mockPage.setContent).toHaveBeenCalled();
      expect(mockPage.setContent).toHaveBeenCalledWith(
        expect.stringContaining('Glossário de Termos'),
        expect.any(Object),
      );
      expect(mockPage.setContent).toHaveBeenCalledWith(
        expect.stringContaining('50.000'),
        expect.any(Object),
      );
      expect(mockPage.setContent).toHaveBeenCalledWith(
        expect.stringContaining('100.000'),
        expect.any(Object),
      );
      expect(mockPage.setContent).toHaveBeenCalledWith(
        expect.stringContaining('10.000'),
        expect.any(Object),
      );
      expect(mockPage.setContent).toHaveBeenCalledWith(
        expect.stringContaining('01 de julho de 2026 às 08:00'),
        expect.any(Object),
      );
      expect(mockPage.setContent).toHaveBeenCalledWith(
        expect.stringContaining('02 de julho de 2026 às 18:30'),
        expect.any(Object),
      );
      expect(mockPage.evaluateHandle).toHaveBeenCalledWith(
        'document.fonts.ready',
      );
      expect(mockPage.pdf).toHaveBeenCalledWith(
        expect.objectContaining({
          format: 'A4',
          printBackground: true,
          displayHeaderFooter: true,
        }),
      );
      expect(mockBrowser.close).toHaveBeenCalled();
    });

    it('should generate internal dossier PDF with operational and commercial metrics', async () => {
      const data = {
        summary: {
          totalRequests: 100000,
          successRate: 90,
          p95Latency: 15,
          rateLimitHits: 2000,
          activeUsers: 5,
          currentRpm: 150,
          averageRpm: 75.2,
        },
        proactiveAlerts: [
          {
            username: 'alert-user',
            email: 'alert@test.com',
            planName: 'Gold',
            monthlyRequests: 9000,
            planReqMonth: 10000,
            usagePercentage: 90,
            notified: true,
          },
        ],
        topUsers: [
          {
            username: 'top-user',
            planName: 'Bronze',
            totalRequests: 10000,
            errorRate: 2,
            monthlyRequests: 12000,
          },
        ],
        databaseLoad: [
          { host: 'localhost', database: 'test-db', totalRequests: 15000 },
        ],
        topEndpoints: [
          {
            method: 'GET',
            path: '/api/v1/test',
            totalRequests: 50,
            successRate: 98,
            avgLatency: 12,
            p95Latency: 20,
          },
        ],
        statusDistribution: [
          { statusClass: '2xx', count: 9000 },
          { statusClass: '4xx', count: 1000 },
        ],
        planDistribution: [
          { planName: 'Gold', totalRequests: 9000 },
          { planName: 'Bronze', totalRequests: 1000 },
        ],
        timeSeries: [
          {
            timestamp: '2026-07-01T00:00:00.000Z',
            count: 100,
            success: 90,
            error: 10,
          },
          {
            timestamp: '2026-07-02T00:00:00.000Z',
            count: 100,
            success: 90,
            error: 10,
          },
        ],
        heartbeat: {
          status: 'ACTIVE',
          lastSeen: new Date('2026-07-08T08:00:00Z'),
        },
      };

      const result = await service.generateDossierPdf(
        'internal',
        data,
        new Date('2026-07-01T12:15:00Z'),
        new Date('2026-07-03T00:45:00Z'),
      );

      expect(result).toEqual(Buffer.from('pdf-data'));
      expect(mockPuppeteer.launch).toHaveBeenCalled();

      const mockBrowser = await mockPuppeteer.launch.mock.results[0].value;
      expect(mockBrowser.newPage).toHaveBeenCalled();

      const mockPage = await mockBrowser.newPage.mock.results[0].value;
      expect(mockPage.setContent).toHaveBeenCalled();
      expect(mockPage.setContent).toHaveBeenCalledWith(
        expect.stringContaining('Glossário de Termos'),
        expect.any(Object),
      );
      // Volume Geral Reqs
      expect(mockPage.setContent).toHaveBeenCalledWith(
        expect.stringContaining('100.000'),
        expect.any(Object),
      );
      // Alerta comercial (9.000 / 10.000)
      expect(mockPage.setContent).toHaveBeenCalledWith(
        expect.stringContaining('9.000 / 10.000'),
        expect.any(Object),
      );
      // Top 10 Clientes (Bronze 10.000)
      expect(mockPage.setContent).toHaveBeenCalledWith(
        expect.stringContaining('10.000'),
        expect.any(Object),
      );
      // Carga BD (15.000)
      expect(mockPage.setContent).toHaveBeenCalledWith(
        expect.stringContaining('15.000'),
        expect.any(Object),
      );
      // Status Distribution (9.000 e 1.000)
      expect(mockPage.setContent).toHaveBeenCalledWith(
        expect.stringContaining('9.000'),
        expect.any(Object),
      );
      expect(mockPage.setContent).toHaveBeenCalledWith(
        expect.stringContaining('1.000'),
        expect.any(Object),
      );
      expect(mockPage.setContent).toHaveBeenCalledWith(
        expect.stringContaining('01 de julho de 2026 às 09:15'),
        expect.any(Object),
      );
      expect(mockPage.setContent).toHaveBeenCalledWith(
        expect.stringContaining('02 de julho de 2026 às 21:45'),
        expect.any(Object),
      );
      expect(mockBrowser.close).toHaveBeenCalled();
    });
  });
});
