import { QueryRunner } from 'typeorm';
import { mock, MockProxy } from 'jest-mock-extended';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { ThemeService } from '@theme/theme.service';
import { ThemeRepository } from '@theme/theme.repository';
import { ThemeLogRepository } from '@theme/theme-log.repository';
import { Environment } from '@common/env';
import { QueryRunnerFactory } from '@database/query-runner.factory';
import { ThemeEntity, ThemeLogEntity } from '@theme/entities';
import { DateUtil } from '@common/utils/date';

describe('ThemeService', () => {
  let service: ThemeService;
  let mockConfigService: MockProxy<ConfigService>;
  let mockThemeRepository: MockProxy<ThemeRepository>;
  let mockThemeLogRepository: MockProxy<ThemeLogRepository>;
  let mockQueryRunnerFactory: MockProxy<QueryRunnerFactory>;
  let mockQueryRunner: MockProxy<QueryRunner>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ThemeService,
        ThemeRepository,
        ThemeLogRepository,
        ConfigService,
        QueryRunnerFactory,
      ],
    })
      .overrideProvider(ThemeRepository)
      .useValue(mock<ThemeRepository>())
      .overrideProvider(ThemeLogRepository)
      .useValue(mock<ThemeLogRepository>())
      .overrideProvider(ConfigService)
      .useValue(mock<ConfigService>())
      .overrideProvider(QueryRunnerFactory)
      .useValue(mock<QueryRunnerFactory>())
      .compile();

    service = module.get<ThemeService>(ThemeService);
    mockThemeRepository = module.get(ThemeRepository);
    mockThemeLogRepository = module.get(ThemeLogRepository);
    mockConfigService = module.get(ConfigService);
    mockQueryRunnerFactory = module.get(QueryRunnerFactory);

    mockQueryRunner = mock<QueryRunner>();
    mockQueryRunnerFactory.create.mockReturnValue(mockQueryRunner);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTodayTheme', () => {
    const theme: ThemeEntity = {
      id: 1,
      text: '오늘의 주제',
    };
    it('오늘의 주제를 정상적으로 반환한다.', async () => {
      const expected = '오늘의 주제';
      mockThemeRepository.getRandomTheme.mockResolvedValue(theme);
      mockConfigService.get.mockReturnValue(Environment.Test);
      await service.onModuleInit();

      const actual = service.getTodayTheme();

      expect(actual.text).toEqual(expected);
    });
  });

  describe('updateTodayTheme', () => {
    const theme = '오늘의 주제';
    const themeEntity: ThemeEntity = {
      id: 1,
      text: theme,
    };
    it('오늘의 주제를 업데이트한다.', async () => {
      const mockGetRandomTheme = mockThemeRepository.getRandomTheme.mockResolvedValue(themeEntity);
      const mockSaveLog = mockThemeLogRepository.saveLog.mockResolvedValue();

      await service.updateTodayTheme();

      expect(mockGetRandomTheme).toHaveBeenCalled();
      expect(mockSaveLog).toHaveBeenCalledWith(themeEntity);
    });
  });

  describe('triggerUpdateTodayTheme', () => {
    const theme = '오늘의 주제';
    const themeEntity: ThemeEntity = {
      id: 1,
      text: theme,
    };

    it('로그가 존재하지 않을 경우, 오늘의 주제를 새롭게 설정한다.', async () => {
      const mockGetLastLog = mockThemeLogRepository.getLastLog.mockResolvedValue(null);
      const mockGetRandomTheme = mockThemeRepository.getRandomTheme.mockResolvedValue(themeEntity);
      const mockConfigGet = mockConfigService.get.mockReturnValue(Environment.Test);

      await service.triggerUpdateTodayTheme();
      const result = service.getTodayTheme();

      expect(mockGetLastLog).toHaveBeenCalled();
      expect(mockConfigGet).not.toHaveBeenCalled();
      expect(mockGetRandomTheme).toHaveBeenCalled();
      expect(result.text).toEqual(themeEntity.text);
    });

    it('로그가 존재하며, 오늘이 지났을 경우 오늘의 주제를 새롭게 설정한다.', async () => {
      jest.useFakeTimers().setSystemTime(DateUtil.date(2025, 4, 2, 5));
      const themeLogEntity: ThemeLogEntity = {
        id: 1,
        theme: {
          id: 1,
          text: '오늘의 주제',
        },
        loggedDate: DateUtil.date(2025, 4, 1, 4),
      };
      mockThemeLogRepository.getLastLog.mockResolvedValue(themeLogEntity);
      const mockFindById = mockThemeRepository.findById.mockResolvedValue(null);
      const mockGetRandomTheme = mockThemeRepository.getRandomTheme.mockResolvedValue(themeEntity);
      const mockSaveLog = mockThemeLogRepository.saveLog.mockResolvedValue();
      mockConfigService.get.mockReturnValue(Environment.Test);

      await service.triggerUpdateTodayTheme();
      const result = service.getTodayTheme();

      expect(mockGetRandomTheme).toHaveBeenCalled();
      expect(mockSaveLog).toHaveBeenCalledWith(themeEntity);
      expect(result.text).toEqual(themeEntity.text);
      expect(mockFindById).not.toHaveBeenCalled();
    });

    it('로그가 존재하며, 오늘이 지나지 않았을 경우 오늘의 주제를 로그로부터 가져온다.', async () => {
      jest.useFakeTimers().setSystemTime(DateUtil.date(2025, 4, 2, 3));
      const theme: ThemeEntity = {
        id: 1,
        text: '오늘의 주제',
      };
      const themeLogEntity: ThemeLogEntity = {
        id: 1,
        theme,
        loggedDate: DateUtil.date(2025, 4, 1, 4),
      };

      mockThemeLogRepository.getLastLog.mockResolvedValue(themeLogEntity);
      const mockFindById = mockThemeRepository.findById.mockResolvedValue(themeEntity);
      const mockGetRandomTheme = mockThemeRepository.getRandomTheme.mockResolvedValue(theme);
      const mockSaveLog = mockThemeLogRepository.saveLog.mockResolvedValue();
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
