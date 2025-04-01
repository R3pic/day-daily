import { QueryRunner } from 'typeorm';
import { mock, MockProxy } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';

import { ThemeService } from '@theme/theme.service';
import { ThemeEntity } from '@theme/entities';
import { DiaryService } from '@diary/diary.service';
import { DiaryRepository } from '@diary/diary.repository';
import { DiaryEntity } from '@diary/entities';
import { CreateDiaryDto, DiaryDto, DeleteDiaryDto } from '@diary/dto';
import { QueryRunnerFactory } from '@database/query-runner.factory';
import { DiaryNotFoundException } from '@diary/exceptions';

describe('DiaryService', () => {
  let service: DiaryService;
  let mockRepository: MockProxy<DiaryRepository>;
  let mockThemeService: MockProxy<ThemeService>;
  let mockQueryRunnerFactory: MockProxy<QueryRunnerFactory>;
  let mockQueryRunner: MockProxy<QueryRunner>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiaryService,
        DiaryRepository,
        ThemeService,
        QueryRunnerFactory,
      ],
    })
      .overrideProvider(DiaryRepository)
      .useValue(mock<DiaryRepository>())
      .overrideProvider(ThemeService)
      .useValue(mock<ThemeService>())
      .overrideProvider(QueryRunnerFactory)
      .useValue(mock<QueryRunnerFactory>())
      .compile();

    service = module.get<DiaryService>(DiaryService);
    mockRepository = module.get(DiaryRepository);
    mockThemeService = module.get(ThemeService);
    mockQueryRunnerFactory = module.get(QueryRunnerFactory);
    mockQueryRunner = mock<QueryRunner>();

    mockQueryRunnerFactory.create.mockReturnValue(mockQueryRunner);

    jest.useFakeTimers().setSystemTime();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createDiary', () => {
    let themeEntity: ThemeEntity;
    let getTodayThemeMock: () => ThemeEntity;

    beforeEach(() => {
      themeEntity = { id: '4', text: '오늘의 주제' };
      getTodayThemeMock = mockThemeService.getTodayTheme.mockReturnValue(themeEntity);
    });

    it('use_theme이 true일 경우 theme_id와 함께 저장된다.', async () => {
      const dto: CreateDiaryDto = {
        use_theme: true,
        title: '테스트 제목',
        content: '테스트 내용',
      };
      const toSaveEntity: DiaryEntity = DiaryEntity.of({
        theme: themeEntity,
        title: dto.title,
        content: dto.content,
      });
      const saveReturnEntity: DiaryEntity = {
        id: '1',
        theme: themeEntity,
        title: '테스트 제목',
        content: '테스트 내용',
        createdAt: new Date(),
      };

      const expected: DiaryDto = {
        id: saveReturnEntity.id,
        title: saveReturnEntity.title,
        content: saveReturnEntity.content,
        created_at: saveReturnEntity.createdAt,
      };
      const saveMock = mockRepository.save.mockResolvedValue(saveReturnEntity);

      const actual = await service.create(dto);

      expect(actual).toEqual(expected);
      expect(getTodayThemeMock).toHaveBeenCalledTimes(1);
      expect(saveMock).toHaveBeenCalledWith(toSaveEntity);
      expect(saveMock).toHaveBeenCalledTimes(1);
    });

    it('use_theme이 false일 경우 theme_id는 저장되지 않는다.', async () => {
      const dto: CreateDiaryDto = {
        use_theme: false,
        title: '테스트 제목',
        content: '테스트 내용',
      };
      const toSaveEntity: DiaryEntity = DiaryEntity.of({
        theme: undefined,
        title: dto.title,
        content: dto.content,
      });
      const saveReturnEntity: DiaryEntity = DiaryEntity.of({
        id: '1',
        theme: undefined,
        title: '테스트 제목',
        content: '테스트 내용',
        createdAt: new Date(),
      });

      const expected: DiaryDto = {
        id: saveReturnEntity.id,
        title: saveReturnEntity.title,
        content: saveReturnEntity.content,
        created_at: saveReturnEntity.createdAt,
      };
      const saveMock = mockRepository.save.mockResolvedValue(saveReturnEntity);

      const actual = await service.create(dto);

      expect(actual).toEqual(expected);
      expect(getTodayThemeMock).toHaveBeenCalledTimes(0);
      expect(saveMock).toHaveBeenCalledWith(toSaveEntity);
      expect(saveMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByRecent', () => {
    let diaryEntities: DiaryEntity[];

    beforeEach(() => {
      diaryEntities = [
        {
          id: '1',
          theme: null,
          title: '일기 제목 샘플',
          content: '일기 내용 샘플입니다.',
          createdAt: new Date(),
        },
        {
          id: '2',
          theme: null,
          title: '일기 제목 샘플',
          content: '일기 내용 샘플입니다.',
          createdAt: new Date(),
        },
        {
          id: '3',
          theme: null,
          title: '일기 제목 샘플',
          content: '일기 내용 샘플입니다.',
          createdAt: new Date(),
        },
        {
          id: '4',
          theme: null,
          title: '일기 제목 샘플',
          content: '일기 내용 샘플입니다.',
          createdAt: new Date(),
        },
        {
          id: '5',
          theme: null,
          title: '일기 제목 샘플',
          content: '일기 내용 샘플입니다.',
          createdAt: new Date(),
        },
      ];
    });

    it('가장 최근 일기 5개를 반환합니다.', async () => {
      const expected: DiaryDto[] = [
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
      mockRepository.findByRecent.mockResolvedValue(diaryEntities);

      const actual = await service.findByRecent();

      expect(actual).toHaveLength(5);
      expect(actual).toEqual(expected);
    });
  });

  describe('delete',  () => {
    it('성공적으로 삭제합니다.', async () => {
      const removeDto: DeleteDiaryDto = {
        id: 'id',
      };
      const removeEntity: DiaryEntity = DiaryEntity.of({ id: 'id' });
      mockRepository.isExist.mockResolvedValue(true);
      const removeMock = mockRepository.delete.mockResolvedValue();

      await service.delete(removeDto);

      expect(removeMock).toHaveBeenCalledWith(removeEntity);
    });

    it('존재하지 않는 ID를 삭제하려고 할 경우 DiaryNotFound를 던집니다.', async () => {
      const removeDto: DeleteDiaryDto = {
        id: 'id',
      };
      mockRepository.isExist.mockResolvedValue(false);
      const removeMock = mockRepository.delete.mockResolvedValue();

      await expect(service.delete(removeDto)).rejects.toThrow(DiaryNotFoundException);
      expect(removeMock).not.toHaveBeenCalled();
    });
  });
});
