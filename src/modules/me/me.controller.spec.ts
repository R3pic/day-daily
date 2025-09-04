import { mock, MockProxy } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';

import { MeController } from '@me/me.controller';
import { CreateDiaryResponse, GetDiaryByUserResponse } from '@diary/responses';
import {
  CreateDiaryDto,
  DeleteDiaryParamDto, DiaryDto,
  UpdateDiaryBody,
  UpdateDiaryDto,
  UpdateDiaryParam,
} from '@diary/dto';
import { RequestUser } from '@common/dto';
import { UpdateUserSettingBody, UserSettingDto } from '@user/dto';
import { GetUserInfoResponse, GetUserSettingResponse } from '@user/responses';
import { MeService } from '@me/me.service';
import { UserInfoDto } from '@user/dto/user-info.dto';

describe('MeController', () => {
  let controller: MeController;
  let service: MockProxy<MeService>;

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeController],
      providers: [
        MeService,
      ],
    })
      .overrideProvider(MeService)
      .useValue(mock<MeService>())
      .compile();

    controller = module.get<MeController>(MeController);
    service = module.get(MeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getDiaries', () => {
    it('일기를 반환한다.', async () => {
      const id = 'uuid';
      const requestUser: RequestUser = {
        id: 'user-uuid',
      };
      const diary: DiaryDto = {
        id: '1',
        title: '테스트 일기',
        content: '테스트 내용',
        author: {
          id,
          full_name: '홍길동',
        },
        created_at: new Date(),
      };
      const expected: GetDiaryByUserResponse = {
        diaries: [diary],

        links: {
          next: '/me/diaries?offset=15&limit=15',
        },
      };
      const mockFindManyByUserId = service.findDiaries.mockResolvedValue([diary]);

      const actual = await controller.getDiaries(requestUser, {});

      expect(actual).toEqual(expected);
      expect(mockFindManyByUserId).toHaveBeenCalledTimes(1);
    });
  });

  describe('createDiary', () => {
    it('일기를 생성한다.', async () => {
      const requestUser: RequestUser = {
        id: 'user-uuid',
      };
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
          author: {
            id: 'user-id',
            full_name: '홍길동',
          },
          created_at: new Date(),
        },
        previous_diaries: [],
      };
      service.createDiary.mockResolvedValue({
        diary: {
          id: '1',
          title: dto.title,
          content: dto.content,
          author: {
            id: 'user-id',
            full_name: '홍길동',
          },
          created_at: new Date(),
        },
        previousDiaries: [],
      });

      const actual = await controller.createDiary(requestUser, dto);

      expect(actual).toEqual(expected);
    });
  });

  describe('updateDiary', () => {
    it('일기를 수정한다.', async () => {
      const requestUser: RequestUser = {
        id: 'user-uuid',
      };
      const updateDiaryParam: UpdateDiaryParam = {
        id: 'id',
      };
      const updateDiaryBody: UpdateDiaryBody = {
        title: '일기 제목',
        content: '일기 내용',
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const updateDiaryDto: UpdateDiaryDto = {
        ...updateDiaryParam,
        ...updateDiaryBody,
      };

      const mockUpdate = service.updateDiary.mockResolvedValue();

      await controller.updateDiary(requestUser, updateDiaryParam, updateDiaryBody);

      expect(mockUpdate).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteDiary', () => {
    it('일기를 삭제한다.', async () => {
      const requestUser: RequestUser = {
        id: 'user-uuid',
      };
      const deleteDiaryParamDto: DeleteDiaryParamDto = {
        id: 'uuid',
      };
      const mockDelete = service.deleteDiary.mockResolvedValue();
      await controller.deleteDiary(requestUser, deleteDiaryParamDto);

      expect(mockDelete).toHaveBeenCalledTimes(1);
    });
  });

  describe('getSetting', () => {
    it('유저 설정을 반환한다.', async () => {
      const requestUser: RequestUser = {
        id: 'uuid',
      };
      const userSettingDto: UserSettingDto = {
        hide_profile: false,
        hide_diaries: false,
      };
      const expected: GetUserSettingResponse = {
        settings: userSettingDto,
      };
      const mockFindByUser = service.findUserSetting.mockResolvedValue(userSettingDto);
      const actual = await controller.getSetting(requestUser);

      expect(mockFindByUser).toHaveBeenCalledTimes(1);
      expect(actual).toEqual(expected);
    });
  });

  describe('updateSetting', () => {
    it('유저 설정을 업데이트 한다.', async () => {
      const requestUser: RequestUser = {
        id: 'uuid',
      };
      const updateUserSettingBody: UpdateUserSettingBody = {
        hide_profile: true,
      };
      const mockUpdateSetting = service.updateUserSetting.mockResolvedValue();
      await controller.updateSetting(
        requestUser,
        updateUserSettingBody,
      );

      expect(mockUpdateSetting).toHaveBeenCalledTimes(1);
    });
  });

  describe('findUserInfo', () => {
    it('사용자 정보를 반환한다.', async () => {
      const requestUser: RequestUser = {
        id: 'uuid',
      };
      const userInfo: UserInfoDto = {
        full_name: 'aaa',
        email: 'email',
        registered_at: new Date('2024-05-20'),
        diary_count: 5,
      };
      const expected: GetUserInfoResponse = {
        user_info: userInfo,
      };

      const mockFindUserInfo = service.findUserInfo.mockResolvedValue(userInfo);

      const actual = await controller.findUserInfo(requestUser);

      expect(actual).toEqual(expected);
      expect(mockFindUserInfo).toHaveBeenCalledTimes(1);
    });
  });
});
