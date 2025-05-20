import { Test, TestingModule } from '@nestjs/testing';
import { mock, MockProxy } from 'jest-mock-extended';
import { UserSettingService } from '@user/user-setting.service';
import { UserSettingRepository } from '@user/user-setting.repository';

describe('UserSettingService', () => {
  let service: UserSettingService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mockRepository: MockProxy<UserSettingRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserSettingService,
        UserSettingRepository,
      ],
    })
      .overrideProvider(UserSettingRepository)
      .useValue(mock<UserSettingRepository>())
      .compile();

    service = module.get<UserSettingService>(UserSettingService);
    mockRepository = module.get(UserSettingRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
