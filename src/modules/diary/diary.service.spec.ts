import { mock, MockProxy } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';

import { ThemeService } from '@theme/theme.service';
import { ThemeEntity } from '@theme/entities';
import { DiaryService } from '@diary/diary.service';
import { DiaryRepository } from '@diary/diary.repository';
import { DiaryEntity } from '@diary/entities';
import {
  CreateDiaryDto,
  DiaryDto,
  DeleteDiaryDto,
  UpdateDiaryDto,
} from '@diary/dto';
import {
  DiaryEditExpiredException, DiaryForbiddenException,
  DiaryNotFoundException,
} from '@diary/exceptions';
import { UserEntity } from '@user/entities';
import { UserService } from '@user/user.service';

describe('DiaryService', () => {
  let service: DiaryService;
  let mockRepository: MockProxy<DiaryRepository>;
  let mockThemeService: MockProxy<ThemeService>;
  let mockUserService: MockProxy<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiaryService,
        DiaryRepository,
        ThemeService,
        UserService,
      ],
    })
      .overrideProvider(DiaryRepository)
      .useValue(mock<DiaryRepository>())
      .overrideProvider(ThemeService)
      .useValue(mock<ThemeService>())
      .overrideProvider(UserService)
      .useValue(mock<UserService>())
      .compile();

    service = module.get<DiaryService>(DiaryService);
    mockRepository = module.get(DiaryRepository);
    mockThemeService = module.get(ThemeService);
    mockUserService = module.get(UserService);

    jest.useFakeTimers().setSystemTime(new Date(2025, 2, 16, 18, 30, 20, 0));
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
      themeEntity = { id: 4, text: '오늘의 주제' };
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
        author: UserEntity.of({
          id: 'user-id',
          fullName: '홍길동',
          nickname: '길동이',
        }),
        createdAt: new Date(),
      };

      const expected: DiaryDto = {
        id: saveReturnEntity.id,
        title: saveReturnEntity.title,
        content: saveReturnEntity.content,
        author: {
          id: 'user-id',
          full_name: '홍길동',
          nickname: '길동이',
        },
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
        author: UserEntity.of({
          id: 'user-id',
          fullName: '홍길동',
          nickname: '길동이',
        }),
        createdAt: new Date(),
      });

      const expected: DiaryDto = {
        id: saveReturnEntity.id,
        title: saveReturnEntity.title,
        content: saveReturnEntity.content,
        author: {
          id: 'user-id',
          full_name: '홍길동',
          nickname: '길동이',
        },
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

  describe('update', () => {
    it('일기를 수정합니다.', async () => {
      const updateDiaryDto: UpdateDiaryDto = {
        id: 'id',
        title: '수정된 일기 제목',
        content: '수정된 일기 내용',
      };
      const author = UserEntity.of({
        id: 'user-id',
        fullName: '홍길동',
      });
      const diaryEntity: DiaryEntity = {
        id: 'id',
        theme: null,
        title: '일기 제목',
        content: '일기 내용',
        author,
        createdAt: new Date(),
      };
      mockUserService.findById.mockResolvedValue(author);
      const mockFindById = mockRepository.findById.mockResolvedValue(diaryEntity);
      const mockUpdate = mockRepository.update.mockResolvedValue();

      await service.update(updateDiaryDto);

      expect(mockFindById).toHaveBeenCalledWith(updateDiaryDto.id);
      expect(mockUpdate).toHaveBeenCalledWith(updateDiaryDto);
    });

    it('존재하지 않는 ID를 수정하려고 할 경우 DiaryNotFoundException을 던집니다.', async () => {
      const updateDiaryDto: UpdateDiaryDto = {
        id: 'id',
        title: '수정된 일기 제목',
        content: '수정된 일기 내용',
      };
      const mockFindById = mockRepository.findById.mockResolvedValue(null);
      const mockUpdate = mockRepository.update.mockResolvedValue();

      await expect(service.update(updateDiaryDto)).rejects.toThrow(DiaryNotFoundException);
      expect(mockFindById).toHaveBeenCalledWith(updateDiaryDto.id);
      expect(mockUpdate).toHaveBeenCalledTimes(0);
    });

    it('일기 수정 기간이 지났을 경우 DiaryEditExpiredException을 던집니다.', async () => {
      const updateDiaryDto: UpdateDiaryDto = {
        id: 'id',
        title: '수정된 일기 제목',
        content: '수정된 일기 내용',
      };
      const author = UserEntity.of({
        id: 'user-id',
        fullName: '홍길동',
      });
      const diaryEntity: DiaryEntity = {
        id: 'id',
        theme: null,
        title: '일기 제목',
        content: '일기 내용',
        author,
        createdAt: new Date(2025, 2, 14, 5, 0, 0, 0),
      };
      mockUserService.findById.mockResolvedValue(author);
      const mockFindById = mockRepository.findById.mockResolvedValue(diaryEntity);
      const mockUpdate = mockRepository.update.mockResolvedValue();

      await expect(service.update(updateDiaryDto)).rejects.toThrow(DiaryEditExpiredException);
      expect(mockFindById).toHaveBeenCalledWith(updateDiaryDto.id);
      expect(mockUpdate).toHaveBeenCalledTimes(0);
    });

    it('다른 사용자의 일기를 수정하려고 하면 DiaryForbiddenException이 발생해야 한다.', async () => {
      const updateDiaryDto: UpdateDiaryDto = {
        id: 'id',
        title: '수정된 일기 제목',
        content: '수정된 일기 내용',
      };
      const requestUser = UserEntity.of({
        id: 'user-id',
        fullName: '홍길동',
      });
      const diaryEntity: DiaryEntity = {
        id: 'id',
        theme: null,
        title: '일기 제목',
        content: '일기 내용',
        author: UserEntity.of({
          id: 'another-user-id',
        }),
        createdAt: new Date(2025, 2, 14, 5, 0, 0, 0),
      };
      mockUserService.findById.mockResolvedValue(requestUser);
      const mockFindById = mockRepository.findById.mockResolvedValue(diaryEntity);
      const mockUpdate = mockRepository.update.mockResolvedValue();

      await expect(service.update(updateDiaryDto)).rejects.toThrow(DiaryForbiddenException);
      expect(mockFindById).toHaveBeenCalledWith(updateDiaryDto.id);
      expect(mockUpdate).toHaveBeenCalledTimes(0);
    });
  });

  describe('findByRecent', () => {
    let diaryEntities: DiaryEntity[];

    beforeEach(() => {
      const author = UserEntity.of({
        id: 'user-id',
        fullName: '홍길동',
      });

      diaryEntities = [
        {
          id: '1',
          theme: null,
          title: '일기 제목 샘플',
          content: '일기 내용 샘플입니다.',
          author,
          createdAt: new Date(),
        },
        {
          id: '2',
          theme: null,
          title: '일기 제목 샘플',
          content: '일기 내용 샘플입니다.',
          author,
          createdAt: new Date(),
        },
        {
          id: '3',
          theme: null,
          title: '일기 제목 샘플',
          content: '일기 내용 샘플입니다.',
          author,
          createdAt: new Date(),
        },
        {
          id: '4',
          theme: null,
          title: '일기 제목 샘플',
          content: '일기 내용 샘플입니다.',
          author,
          createdAt: new Date(),
        },
        {
          id: '5',
          theme: null,
          title: '일기 제목 샘플',
          content: '일기 내용 샘플입니다.',
          author,
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
          author: {
            id: 'user-id',
            full_name: '홍길동',
          },
          created_at: new Date(),
        },
        {
          id: '2',
          title: '일기 제목 샘플',
          content: '일기 내용 샘플입니다.',
          author: {
            id: 'user-id',
            full_name: '홍길동',
          },
          created_at: new Date(),
        },
        {
          id: '3',
          title: '일기 제목 샘플',
          content: '일기 내용 샘플입니다.',
          author: {
            id: 'user-id',
            full_name: '홍길동',
          },
          created_at: new Date(),
        },
        {
          id: '4',
          title: '일기 제목 샘플',
          content: '일기 내용 샘플입니다.',
          author: {
            id: 'user-id',
            full_name: '홍길동',
          },
          created_at: new Date(),
        },
        {
          id: '5',
          title: '일기 제목 샘플',
          content: '일기 내용 샘플입니다.',
          author: {
            id: 'user-id',
            full_name: '홍길동',
          },
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
      const userEntity: UserEntity = UserEntity.of({
        id: 'user-id',
        fullName: '홍길동',
      });
      const targetEntity: DiaryEntity = DiaryEntity.of({
        id: 'id',
        author: userEntity,
      });
      mockUserService.findById.mockResolvedValue(userEntity);
      const findByIdMock = mockRepository.findById.mockResolvedValue(targetEntity);
      const deleteMock = mockRepository.delete.mockResolvedValue();

      await service.delete(removeDto);

      expect(findByIdMock).toHaveBeenCalledWith(removeDto.id);
      expect(deleteMock).toHaveBeenCalledWith(targetEntity);
    });

    it('존재하지 않는 ID를 삭제하려고 하면 DiaryNotFound이 발생해야 한다.', async () => {
      const userEntity: UserEntity = UserEntity.of({
        id: 'user-id',
        fullName: '홍길동',
      });
      const removeDto: DeleteDiaryDto = {
        id: 'id',
      };
      mockUserService.findById.mockResolvedValue(userEntity);
      mockRepository.findById.mockResolvedValue(null);
      const removeMock = mockRepository.delete.mockResolvedValue();

      await expect(service.delete(removeDto)).rejects.toThrow(DiaryNotFoundException);
      expect(removeMock).not.toHaveBeenCalled();
    });

    it('다른 사용자의 일기를 삭제하려고 하면 DiaryForbiddenException이 발생해야 한다.', async () => {
      const userEntity: UserEntity = UserEntity.of({
        id: 'user-id',
        fullName: '홍길동',
      });
      const targetEntity: DiaryEntity = DiaryEntity.of({
        id: 'id',
        author: UserEntity.of({
          id: 'another-user-id',
        }),
      });
      const removeDto: DeleteDiaryDto = {
        id: 'id',
      };
      mockUserService.findById.mockResolvedValue(userEntity);
      mockRepository.findById.mockResolvedValue(targetEntity);
      const removeMock = mockRepository.delete.mockResolvedValue();

      await expect(service.delete(removeDto)).rejects.toThrow(DiaryForbiddenException);
      expect(removeMock).not.toHaveBeenCalled();
    });
  });
});
