import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { DossierPdfService } from './dossier-pdf.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { BadRequestException } from '@nestjs/common';

jest.mock('puppeteer');

describe('DashboardController', () => {
  let controller: DashboardController;
  let service: jest.Mocked<DashboardService>;
  let pdfService: jest.Mocked<DossierPdfService>;

  beforeEach(async () => {
    const mockDashboardService = {
      getSummary: jest.fn(),
      getTopUsers: jest.fn(),
      getTopEndpoints: jest.fn(),
      getStatusDistribution: jest.fn(),
      getTimeSeries: jest.fn(),
      getProactiveAlerts: jest.fn(),
      getHeartbeatStatus: jest.fn(),
      getRequestLogs: jest.fn(),
      getDatabaseLoad: jest.fn(),
      getPlanDistribution: jest.fn(),
      getDossierData: jest.fn(),
    };

    const mockDossierPdfService = {
      generateDossierPdf: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        { provide: DashboardService, useValue: mockDashboardService },
        { provide: DossierPdfService, useValue: mockDossierPdfService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<DashboardController>(DashboardController);
    service = module.get(DashboardService) as any;
    pdfService = module.get(DossierPdfService) as any;
  });

  describe('downloadDossier', () => {
    it('should throw BadRequestException if client dossier is requested without userId', async () => {
      const mockRes = {
        setHeader: jest.fn(),
        end: jest.fn(),
      } as any;

      await expect(
        controller.downloadDossier(mockRes, 'client', undefined, '2026-07-01', '2026-07-02'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should generate and stream internal dossier PDF', async () => {
      const mockRes = {
        setHeader: jest.fn(),
        end: jest.fn(),
      } as any;

      const mockData = { type: 'internal' };
      const mockPdfBuffer = Buffer.from('pdf-content');

      service.getDossierData.mockResolvedValueOnce(mockData);
      pdfService.generateDossierPdf.mockResolvedValueOnce(mockPdfBuffer);

      await controller.downloadDossier(mockRes, 'internal', undefined, '2026-07-01', '2026-07-02');

      expect(service.getDossierData).toHaveBeenCalledWith(
        'internal',
        expect.any(Date),
        expect.any(Date),
        undefined,
      );
      expect(pdfService.generateDossierPdf).toHaveBeenCalledWith(
        'internal',
        mockData,
        expect.any(Date),
        expect.any(Date),
      );
      expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
      expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Length', mockPdfBuffer.length);
      expect(mockRes.end).toHaveBeenCalledWith(mockPdfBuffer);
    });

    it('should generate and stream client dossier PDF', async () => {
      const mockRes = {
        setHeader: jest.fn(),
        end: jest.fn(),
      } as any;

      const mockData = { type: 'client', user: { username: 'test-user' } };
      const mockPdfBuffer = Buffer.from('pdf-content');

      service.getDossierData.mockResolvedValueOnce(mockData);
      pdfService.generateDossierPdf.mockResolvedValueOnce(mockPdfBuffer);

      await controller.downloadDossier(mockRes, 'client', 'user-id', '2026-07-01', '2026-07-02');

      expect(service.getDossierData).toHaveBeenCalledWith(
        'client',
        expect.any(Date),
        expect.any(Date),
        'user-id',
      );
      expect(pdfService.generateDossierPdf).toHaveBeenCalledWith(
        'client',
        mockData,
        expect.any(Date),
        expect.any(Date),
      );
      expect(mockRes.end).toHaveBeenCalledWith(mockPdfBuffer);
    });
  });
});
