import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from '@user/user.repository';
import { mock, MockProxy } from 'jest-mock-extended';
import { UserEntity } from '@user/entities';
import { UserNotFoundException } from '@user/exceptions';
import { UserSettingService } from '@user/user-setting.service';
import { UserSettingRepository } from '@user/user-setting.repository';
import { HashService } from '@auth/hash.service';
import { FileService } from '@file/file.service';

describe('UserService', () => {
  let service: UserService;
  let mockRepository: MockProxy<UserRepository>;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userSettingService: MockProxy<UserSettingService>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userSettingRepository: MockProxy<UserSettingRepository>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let hashService: MockProxy<HashService>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let fileService: MockProxy<FileService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        UserSettingService,
        UserRepository,
        UserSettingRepository,
        HashService,
        FileService,
      ],
    })
      .overrideProvider(UserRepository)
      .useValue(mock<UserRepository>())
      .overrideProvider(UserSettingService)
      .useValue(mock<UserSettingService>())
      .overrideProvider(UserSettingRepository)
      .useValue(mock<UserSettingRepository>())
      .overrideProvider(HashService)
      .useValue(mock<HashService>())
      .compile();

    service = module.get<UserService>(UserService);
    mockRepository = module.get(UserRepository);
    userSettingService = module.get(UserSettingService);
    userSettingRepository = module.get(UserSettingRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('id에 해당하는 사용자를 반환한다.', async () => {
      const id = 'id';
      const mockUserEntity: UserEntity = UserEntity.of({
        id,
        fullName: '홍길동',
        nickname: '길동이',
        createdAt: new Date(),
      });
      const findByIdMock = mockRepository.findById.mockResolvedValue(mockUserEntity);

      const actual = await service.findById(id);

      expect(actual).toEqual(mockUserEntity);
      expect(findByIdMock).toHaveBeenCalledWith(id);
      expect(findByIdMock).toHaveBeenCalledTimes(1);
    });

    it('사용자를 찾을 수 없다면 UserNotFoundException을 던집니다.', async () => {
      const id = 'id';
      const findByIdMock = mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById(id)).rejects.toThrow(UserNotFoundException);
      expect(findByIdMock).toHaveBeenCalledWith(id);
      expect(findByIdMock).toHaveBeenCalledTimes(1);
    });
  });
});
