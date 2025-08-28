import { mock, MockProxy } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';

import { DiaryService } from '@diary/diary.service';
import { DiaryDto } from '@diary/dto';
import { UserController } from './user.controller';
import { GetUserDiariesParam } from '@user/dto';
import { GetDiaryByUserResponse } from '@diary/responses';
import { RequestUser } from '@common/dto';
import { UserService } from '@user/user.service';
import { UserInfoService } from '@user/user-info.service';

describe('UserController', () => {
  let controller: UserController;
  let mockDiaryService: MockProxy<DiaryService>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mockUserService: MockProxy<UserService>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mockUserInfoService: MockProxy<UserInfoService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        DiaryService,
        UserService,
        UserInfoService,
      ],
    })
      .overrideProvider(DiaryService)
      .useValue(mock<DiaryService>())
      .overrideProvider(UserService)
      .useValue(mock<UserService>())
      .overrideProvider(UserInfoService)
      .useValue(mock<UserInfoService>())
      .compile();

    controller = module.get<UserController>(UserController);
    mockDiaryService = module.get(DiaryService);
    mockUserService = module.get(UserService);
    mockUserInfoService = module.get(UserInfoService);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findByUser', () => {
    it('요청이 성공한 경우', async () => {
      const requestUser: RequestUser = {
        id: 'uuid',
      };
      const diary: DiaryDto = {
        id: 'id',
        title: '일기 제목',
        content: '일기 내용',
        author: {
          id: 'user-id',
          full_name: '테스트이름',
          nickname: '테스트닉네임',
        },
        created_at: new Date(),
      };
      const expected: GetDiaryByUserResponse = {
        diaries: [
          diary,
        ],

        links: {
          next: '/users/user-id/diaries?offset=15&limit=15',
        },
      };
      const dto: GetUserDiariesParam = {
        id: 'user-id',
      };
      const findManyByUserIdMock = mockDiaryService.findManyByUserId.mockResolvedValue([diary]);

      const actual = await controller.getUserDiaries(requestUser, dto, {});

      expect(actual).toEqual(expected);
      expect(findManyByUserIdMock).toHaveBeenCalledTimes(1);
    });
  });
});
