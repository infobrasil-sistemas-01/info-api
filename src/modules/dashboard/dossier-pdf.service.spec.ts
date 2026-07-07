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
  });
});
