import { Test, TestingModule } from '@nestjs/testing';
import { AnnouncementController } from './announcement.controller';
import { AnnouncementService } from './announcement.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

describe('AnnouncementController', () => {
  let controller: AnnouncementController;
  let mockService: any;

  beforeEach(async () => {
    mockService = {
      findAllForUser: jest.fn(),
      findReadForUser: jest.fn(),
      markAsViewed: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnnouncementController],
      providers: [{ provide: AnnouncementService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AnnouncementController>(AnnouncementController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should call service.findAllForUser with user sub', async () => {
      mockService.findAllForUser.mockResolvedValue([]);
      const user = { sub: 'user-123' };

      const result = await controller.findAll(user);
      expect(result).toEqual([]);
      expect(mockService.findAllForUser).toHaveBeenCalledWith('user-123');
    });
  });

  describe('findReadForUser', () => {
    it('should call service.findReadForUser with user sub', async () => {
      mockService.findReadForUser.mockResolvedValue([]);
      const user = { sub: 'user-123' };

      const result = await controller.findReadForUser(user);
      expect(result).toEqual([]);
      expect(mockService.findReadForUser).toHaveBeenCalledWith('user-123');
    });
  });

  describe('markAsViewed', () => {
    it('should call service.markAsViewed with user sub and announcement id', async () => {
      mockService.markAsViewed.mockResolvedValue({ id: 'view-id' });
      const user = { sub: 'user-123' };

      const result = await controller.markAsViewed(user, 'ann-456');
      expect(result).toEqual({ id: 'view-id' });
      expect(mockService.markAsViewed).toHaveBeenCalledWith(
        'user-123',
        'ann-456',
      );
    });
  });

  describe('findAllAdmin', () => {
    it('should call service.findAll', async () => {
      mockService.findAll.mockResolvedValue([]);
      const result = await controller.findAllAdmin();
      expect(result).toEqual([]);
      expect(mockService.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should call service.create with body data', async () => {
      const data = { text: 'New announcement' };
      mockService.create.mockResolvedValue({ id: '1', ...data });

      const result = await controller.create(data);
      expect(result).toEqual({ id: '1', ...data });
      expect(mockService.create).toHaveBeenCalledWith(data);
    });
  });

  describe('update', () => {
    it('should call service.update with id and body data', async () => {
      const data = { text: 'Updated announcement' };
      mockService.update.mockResolvedValue({ id: '1', ...data });

      const result = await controller.update('1', data);
      expect(result).toEqual({ id: '1', ...data });
      expect(mockService.update).toHaveBeenCalledWith('1', data);
    });
  });

  describe('remove', () => {
    it('should call service.delete with id', async () => {
      mockService.delete.mockResolvedValue({ id: '1' });

      const result = await controller.remove('1');
      expect(result).toEqual({ id: '1' });
      expect(mockService.delete).toHaveBeenCalledWith('1');
    });
  });
});
