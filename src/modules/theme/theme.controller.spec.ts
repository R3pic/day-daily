import { mock, MockProxy } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';

import { ThemeController } from '@theme/theme.controller';
import { ThemeService } from '@theme/theme.service';
import { TodayThemeResponse } from '@theme/responses';

describe('ThemeController', () => {
  let controller: ThemeController;
  let service: MockProxy<ThemeService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThemeController],
      providers: [ThemeService],
    })
      .overrideProvider(ThemeService)
      .useValue(mock<ThemeService>())
      .compile();

    controller = module.get<ThemeController>(ThemeController);
    service = module.get<MockProxy<ThemeService>>(ThemeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('today', () => {
    const theme = '오늘의 주제';

    it('서비스에서 받은 오늘의 주제를 응답의 형식에 맞게 반환한다.', () => {
      const expected: TodayThemeResponse = {
        theme,
      };
      const getTodayThemeMock = service.getTodayTheme.mockReturnValue(theme);

      const actual = controller.today();

      expect(getTodayThemeMock).toHaveBeenCalled();
      expect(actual).toEqual(expected);
    });
  });
});
