import { mock, MockProxy } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';

import { DiaryController } from '@diary/diary.controller';
import { DiaryService } from '@diary/diary.service';
import { DiaryDto } from '@diary/dto';
import { GetRecentDiaryResponse } from '@diary/responses';
import { PaginationQuery } from '@diary/dto/pagination-query.dto';

describe('DiaryController', () => {
  let controller: DiaryController;
  let mockService: MockProxy<DiaryService>;

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

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
      const author =  {
        id: 'user-id',
        full_name: '홍길동',
      };
      const diaries: DiaryDto[] = [
        {
          id: '1',
          title: '일기 제목 샘플',
          content: '일기 내용 샘플입니다.',
          author,
          created_at: new Date(),
        },
        {
          id: '2',
          title: '일기 제목 샘플',
          content: '일기 내용 샘플입니다.',
          author,
          created_at: new Date(),
        },
        {
          id: '3',
          title: '일기 제목 샘플',
          content: '일기 내용 샘플입니다.',
          author,
          created_at: new Date(),
        },
        {
          id: '4',
          title: '일기 제목 샘플',
          content: '일기 내용 샘플입니다.',
          author,
          created_at: new Date(),
        },
      ];
      const expected: GetRecentDiaryResponse = {
        diaries,
        links: {
          next: '/diaries/recent?offset=4&limit=4',
        },
      };
      mockService.findByRecent.mockResolvedValue(diaries);

      const actual = await controller.recent({});

      expect(actual.diaries).toHaveLength(4);
      expect(actual).toEqual(expected);
    });

    it('올바른 다음 링크를 반환한다.', async () => {
      const author =  {
        id: 'user-id',
        full_name: '홍길동',
      };
      const diaries: DiaryDto[] = [
        {
          id: '1',
          title: '일기 제목 샘플',
          content: '일기 내용 샘플입니다.',
          author,
          created_at: new Date(),
        },
        {
          id: '2',
          title: '일기 제목 샘플',
          content: '일기 내용 샘플입니다.',
          author,
          created_at: new Date(),
        },
        {
          id: '3',
          title: '일기 제목 샘플',
          content: '일기 내용 샘플입니다.',
          author,
          created_at: new Date(),
        },
        {
          id: '4',
          title: '일기 제목 샘플',
          content: '일기 내용 샘플입니다.',
          author,
          created_at: new Date(),
        },
      ];
      const query: PaginationQuery = {
        offset: 8,
        limit: 4,
      };
      const expected: GetRecentDiaryResponse = {
        diaries,
        links: {
          next: '/diaries/recent?offset=12&limit=4',
        },
      };
      mockService.findByRecent.mockResolvedValue(diaries);

      const actual = await controller.recent(query);

      expect(actual.diaries).toHaveLength(4);
      expect(actual).toEqual(expected);
    });
  });
});
