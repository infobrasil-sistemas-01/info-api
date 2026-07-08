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
        user: { username: 'test-user', monthlyRequests: 50, planReqMonth: 100 },
        summary: { totalRequests: 10, successRate: 100, p95Latency: 15, rateLimitHits: 0 },
        timeSeries: [{ timestamp: '2026-07-01', count: 10, success: 10, error: 0 }],
        statusDistribution: [{ statusClass: '2xx', count: 10 }],
        topEndpoints: [],
      };

      const result = await service.generateDossierPdf(
        'client',
        data,
        new Date('2026-07-01'),
        new Date('2026-07-02'),
      );

      expect(result).toEqual(Buffer.from('pdf-data'));
      expect(mockPuppeteer.launch).toHaveBeenCalled();
      
      const mockBrowser = await mockPuppeteer.launch.mock.results[0].value;
      expect(mockBrowser.newPage).toHaveBeenCalled();
      
      const mockPage = await mockBrowser.newPage.mock.results[0].value;
      expect(mockPage.setContent).toHaveBeenCalled();
      expect(mockPage.evaluateHandle).toHaveBeenCalledWith('document.fonts.ready');
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
        summary: { totalRequests: 100, successRate: 90, p95Latency: 15, rateLimitHits: 2, activeUsers: 5 },
        proactiveAlerts: [
          { username: 'alert-user', email: 'alert@test.com', planName: 'Gold', monthlyRequests: 90, planReqMonth: 100, usagePercentage: 90 }
        ],
        topUsers: [
          { username: 'top-user', planName: 'Bronze', totalRequests: 100, errorRate: 2, monthlyRequests: 120 }
        ],
        databaseLoad: [
          { host: 'localhost', database: 'test-db', totalRequests: 150 }
        ],
        topEndpoints: [
          { method: 'GET', path: '/api/v1/test', totalRequests: 50, successRate: 98, avgLatency: 12, p95Latency: 20 }
        ],
        statusDistribution: [
          { statusClass: '2xx', count: 90 },
          { statusClass: '4xx', count: 10 }
        ],
        planDistribution: [
          { planName: 'Gold', totalRequests: 90 },
          { planName: 'Bronze', totalRequests: 10 }
        ],
        timeSeries: [
          { timestamp: '2026-07-01T00:00:00.000Z', count: 100, success: 90, error: 10 },
          { timestamp: '2026-07-02T00:00:00.000Z', count: 100, success: 90, error: 10 }
        ],
        heartbeat: {
          status: 'ACTIVE',
          lastSeen: new Date('2026-07-08T08:00:00Z'),
        },
      };

      const result = await service.generateDossierPdf(
        'internal',
        data,
        new Date('2026-07-01'),
        new Date('2026-07-02'),
      );

      expect(result).toEqual(Buffer.from('pdf-data'));
      expect(mockPuppeteer.launch).toHaveBeenCalled();
      
      const mockBrowser = await mockPuppeteer.launch.mock.results[0].value;
      expect(mockBrowser.newPage).toHaveBeenCalled();
      
      const mockPage = await mockBrowser.newPage.mock.results[0].value;
      expect(mockPage.setContent).toHaveBeenCalled();
      expect(mockBrowser.close).toHaveBeenCalled();
    });
  });
});
