import { mock, MockProxy } from 'jest-mock-extended';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { ThemeService } from '@theme/theme.service';
import { ThemeRepository } from '@theme/theme.repository';
import { Environment } from '@common/env';
import { ThemeEntity } from '@theme/entities/theme.entity';
import { ThemeLogEntity } from '@theme/entities/theme-log.entity';

describe('ThemeService', () => {
  let service: ThemeService;
  let mockConfigService: MockProxy<ConfigService>;
  let mockRepository: MockProxy<ThemeRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ThemeService,
        ThemeRepository,
        ConfigService,
      ],
    })
      .overrideProvider(ThemeRepository)
      .useValue(mock<ThemeRepository>())
      .overrideProvider(ConfigService)
      .useValue(mock<ConfigService>())
      .compile();

    service = module.get<ThemeService>(ThemeService);
    mockRepository = module.get(ThemeRepository);
    mockConfigService = module.get(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTodayTheme', () => {
    const theme: ThemeEntity = {
      id: '1',
      text: '오늘의 주제',
    };
    it('오늘의 주제를 정상적으로 반환한다.', async () => {
      const expected = '오늘의 주제';
      mockRepository.getRandomTheme.mockResolvedValue(theme);
      mockConfigService.get.mockReturnValue(Environment.Test);
      await service.onModuleInit();

      const actual = service.getTodayTheme();

      expect(actual.text).toEqual(expected);
    });
  });

  describe('updateTodayTheme', () => {
    const theme = '오늘의 주제';
    const themeEntity: ThemeEntity = {
      id: '1',
      text: theme,
    };
    it('오늘의 주제를 업데이트한다.', async () => {
      const mockGetRandomTheme = mockRepository.getRandomTheme.mockResolvedValue(themeEntity);
      const mockSaveLog = mockRepository.saveLog.mockResolvedValue();

      await service.updateTodayTheme();

      expect(mockGetRandomTheme).toHaveBeenCalled();
      expect(mockSaveLog).toHaveBeenCalledWith(themeEntity);
    });
  });

  describe('triggerUpdateTodayTheme', () => {
    const theme = '오늘의 주제';
    const themeEntity: ThemeEntity = {
      id: '1',
      text: theme,
    };

    it('로그가 존재하지 않을 경우, 오늘의 주제를 새롭게 설정한다.', async () => {
      const mockGetLastLog = mockRepository.getLastLog.mockResolvedValue(null);
      const mockGetRandomTheme = mockRepository.getRandomTheme.mockResolvedValue(themeEntity);
      const mockConfigGet = mockConfigService.get.mockReturnValue(Environment.Test);

      await service.triggerUpdateTodayTheme();
      const result = service.getTodayTheme();

      expect(mockGetLastLog).toHaveBeenCalled();
      expect(mockConfigGet).not.toHaveBeenCalled();
      expect(mockGetRandomTheme).toHaveBeenCalled();
      expect(result.text).toEqual(themeEntity.text);
    });

    it('로그가 존재하며, 오늘이 지났을 경우 오늘의 주제를 새롭게 설정한다.', async () => {
      const themeLogEntity: ThemeLogEntity = {
        id: '1',
        theme_id: '1',
        created_at: new Date('1990-01-01'),
      };
      mockRepository.getLastLog.mockResolvedValue(themeLogEntity);
      const mockFindById = mockRepository.findById.mockResolvedValue(null);
      const mockGetRandomTheme = mockRepository.getRandomTheme.mockResolvedValue(themeEntity);
      const mockSaveLog = mockRepository.saveLog.mockResolvedValue();
      mockConfigService.get.mockReturnValue(Environment.Test);

      await service.triggerUpdateTodayTheme();
      const result = service.getTodayTheme();

      expect(mockGetRandomTheme).toHaveBeenCalled();
      expect(mockSaveLog).toHaveBeenCalledWith(themeEntity);
      expect(result.text).toEqual(themeEntity.text);
      expect(mockFindById).not.toHaveBeenCalled();
    });

    it('로그가 존재하며, 오늘이 지나지 않았을 경우 오늘의 주제를 로그로부터 가져온다.', async () => {
      const themeLogEntity: ThemeLogEntity = {
        id: '1',
        theme_id: '1',
        created_at: new Date(),
      };
      mockRepository.getLastLog.mockResolvedValue(themeLogEntity);
      const mockFindById = mockRepository.findById.mockResolvedValue(themeEntity);
      const mockGetRandomTheme = mockRepository.getRandomTheme.mockResolvedValue({ id: '2', text: '' });
      const mockSaveLog = mockRepository.saveLog.mockResolvedValue();
      mockConfigService.get.mockReturnValue(Environment.Test);

      await service.triggerUpdateTodayTheme();
      const result = service.getTodayTheme();

      expect(mockGetRandomTheme).not.toHaveBeenCalled();
      expect(mockSaveLog).not.toHaveBeenCalled();
      expect(result.text).toEqual(themeEntity.text);
      expect(mockFindById).toHaveBeenCalled();
    });
  });
});
