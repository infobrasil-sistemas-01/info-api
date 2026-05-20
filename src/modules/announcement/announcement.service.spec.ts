import { Test, TestingModule } from '@nestjs/testing';
import { AnnouncementService } from './announcement.service';
import { RegistryPrismaService } from 'src/infra/prisma/registry-prisma.service';

describe('AnnouncementService', () => {
  let service: AnnouncementService;
  let mockPrisma: any;

  beforeEach(async () => {
    mockPrisma = {
      announcement: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      announcementView: {
        upsert: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnnouncementService,
        { provide: RegistryPrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AnnouncementService>(AnnouncementService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllForUser', () => {
    it('should query unread announcements for user', async () => {
      const mockResult = [{ id: '1', text: 'Unread 1' }];
      mockPrisma.announcement.findMany.mockResolvedValue(mockResult);

      const result = await service.findAllForUser('user-id');
      expect(result).toEqual(mockResult);
      expect(mockPrisma.announcement.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            active: true,
            views: {
              none: {
                userId: 'user-id',
              },
            },
          }),
        }),
      );
    });
  });

  describe('findReadForUser', () => {
    it('should query read announcements for user', async () => {
      const mockResult = [{ id: '2', text: 'Read 1' }];
      mockPrisma.announcement.findMany.mockResolvedValue(mockResult);

      const result = await service.findReadForUser('user-id');
      expect(result).toEqual(mockResult);
      expect(mockPrisma.announcement.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            active: true,
            views: {
              some: {
                userId: 'user-id',
              },
            },
          }),
        }),
      );
    });
  });

  describe('markAsViewed', () => {
    it('should upsert announcement view for user', async () => {
      mockPrisma.announcementView.upsert.mockResolvedValue({ id: 'view-id' });

      const result = await service.markAsViewed('user-id', 'ann-id');
      expect(result).toEqual({ id: 'view-id' });
      expect(mockPrisma.announcementView.upsert).toHaveBeenCalledWith({
        where: {
          announcementId_userId: {
            announcementId: 'ann-id',
            userId: 'user-id',
          },
        },
        create: {
          announcementId: 'ann-id',
          userId: 'user-id',
        },
        update: {},
      });
    });
  });

  describe('findAll', () => {
    it('should query all announcements with count of views', async () => {
      const mockResult = [{ id: '1', _count: { views: 5 } }];
      mockPrisma.announcement.findMany.mockResolvedValue(mockResult);

      const result = await service.findAll();
      expect(result).toEqual(mockResult);
      expect(mockPrisma.announcement.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: {
            _count: {
              select: { views: true },
            },
          },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a single announcement by id', async () => {
      const mockResult = { id: '1', text: 'Announcement 1' };
      mockPrisma.announcement.findUnique.mockResolvedValue(mockResult);

      const result = await service.findOne('1');
      expect(result).toEqual(mockResult);
      expect(mockPrisma.announcement.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('create', () => {
    it('should create a new announcement', async () => {
      const input = { text: 'New', active: true };
      const mockResult = { id: '1', ...input };
      mockPrisma.announcement.create.mockResolvedValue(mockResult);

      const result = await service.create(input);
      expect(result).toEqual(mockResult);
      expect(mockPrisma.announcement.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            text: 'New',
            active: true,
          }),
        }),
      );
    });
  });

  describe('update', () => {
    it('should update an existing announcement', async () => {
      const input = { text: 'Updated' };
      const mockResult = { id: '1', text: 'Updated' };
      mockPrisma.announcement.update.mockResolvedValue(mockResult);

      const result = await service.update('1', input);
      expect(result).toEqual(mockResult);
      expect(mockPrisma.announcement.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: '1' },
          data: expect.objectContaining({
            text: 'Updated',
          }),
        }),
      );
    });
  });

  describe('delete', () => {
    it('should delete an announcement by id', async () => {
      mockPrisma.announcement.delete.mockResolvedValue({ id: '1' });

      const result = await service.delete('1');
      expect(result).toEqual({ id: '1' });
      expect(mockPrisma.announcement.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
