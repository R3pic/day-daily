import { mock, MockProxy } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';

import { DiaryController } from '@diary//diary.controller';
import { DiaryService } from '@diary/diary.service';
import { DiaryDto } from '@diary/dto';
import { GetRecentDiaryResponse } from '@diary/responses';

describe('DiaryController', () => {
  let controller: DiaryController;
  let mockService: MockProxy<DiaryService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiaryController],
      providers: [DiaryService],
    })
      .overrideProvider(DiaryService)
      .useValue(mock<DiaryService>())
      .compile();

    controller = module.get<DiaryController>(DiaryController);
    mockService = module.get(DiaryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('recent', () => {
    it('가장 최근 5개의 일기 목록을 반환한다.', async () => {
      const diaries: DiaryDto[] = [
        {
          id: '1',
          title: '일기 제목 샘플',
          content: '일기 내용 샘플입니다.',
          created_at: new Date(),
        },
        {
          id: '2',
          title: '일기 제목 샘플',
          content: '일기 내용 샘플입니다.',
          created_at: new Date(),
        },
        {
          id: '3',
          title: '일기 제목 샘플',
          content: '일기 내용 샘플입니다.',
          created_at: new Date(),
        },
        {
          id: '4',
          title: '일기 제목 샘플',
          content: '일기 내용 샘플입니다.',
          created_at: new Date(),
        },
        {
          id: '5',
          title: '일기 제목 샘플',
          content: '일기 내용 샘플입니다.',
          created_at: new Date(),
        },
      ];
      const expected: GetRecentDiaryResponse = {
        diaries,
      };
      mockService.findByRecent.mockResolvedValue(diaries);

      const actual = await controller.recent();

      expect(actual.diaries).toHaveLength(5);
      expect(actual).toEqual(expected);
    });
  });
});
