import { mock, MockProxy } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';

import { MeController } from '@me/me.controller';
import { DiaryService } from '@diary/diary.service';
import { CreateDiaryResponse } from '@diary/responses';
import { CreateDiaryDto, DeleteDiaryDto, UpdateDiaryBody, UpdateDiaryDto, UpdateDiaryParam } from '@diary/dto';

describe('MeController', () => {
  let controller: MeController;
  let mockDiaryService: MockProxy<DiaryService>;

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeController],
      providers: [DiaryService],
    })
      .overrideProvider(DiaryService)
      .useValue(mock<DiaryService>())
      .compile();

    controller = module.get<MeController>(MeController);
    mockDiaryService = module.get(DiaryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createDiary', () => {
    it('일기를 생성한다.', async () => {
      const dto: CreateDiaryDto = {
        use_theme: true,
        title: '테스트 일기',
        content: '테스트 내용',
      };
      const expected: CreateDiaryResponse = {
        diary: {
          id: '1',
          title: '테스트 일기',
          content: '테스트 내용',
          created_at: new Date(),
        },
      };
      const diaryCreateMock = mockDiaryService.create.mockResolvedValue({
        id: '1',
        title: dto.title,
        content: dto.content,
        created_at: new Date(),
      });

      const actual = await controller.createDiary(dto);

      expect(diaryCreateMock).toHaveBeenCalledWith(dto);
      expect(actual).toEqual(expected);
    });
  });

  describe('updateDiary', () => {
    it('일기를 수정한다.', async () => {
      const updateDiaryParam: UpdateDiaryParam = {
        id: 'id',
      };
      const updateDiaryBody: UpdateDiaryBody = {
        title: '일기 제목',
        content: '일기 내용',
      };
      const updateDiaryDto: UpdateDiaryDto = {
        ...updateDiaryParam,
        ...updateDiaryBody,
      };

      const mockUpdate = mockDiaryService.update.mockResolvedValue();

      await controller.updateDiary(updateDiaryParam, updateDiaryBody);

      expect(mockUpdate).toHaveBeenCalledWith(updateDiaryDto);
      expect(mockUpdate).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteDiary', () => {
    it('일기를 삭제한다.', async () => {
      const deleteDto: DeleteDiaryDto = {
        id: 'uuid',
      };
      const mockDelete = mockDiaryService.delete.mockResolvedValue();
      await controller.deleteDiary(deleteDto);

      expect(mockDelete).toHaveBeenCalledWith(deleteDto);
      expect(mockDelete).toHaveBeenCalledTimes(1);
    });
  });
});
