import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from '@user/user.repository';
import { mock, MockProxy } from 'jest-mock-extended';
import { UserEntity } from '@user/entities';
import { UserNotFoundException } from '@user/exceptions';

describe('UserService', () => {
  let service: UserService;
  let mockRepository: MockProxy<UserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        UserRepository,
      ],
    })
      .overrideProvider(UserRepository)
      .useValue(mock<UserRepository>())
      .compile();

    service = module.get<UserService>(UserService);
    mockRepository = module.get(UserRepository);
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
