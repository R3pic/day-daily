import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { mock, MockProxy } from 'jest-mock-extended';
import { RegisterDto } from '@auth/dto';
import { RequestUser } from '@common/dto';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: MockProxy<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mock<AuthService>())
      .compile();

    controller = module.get<AuthController>(AuthController);
    mockAuthService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('회원가입 요청 시 서비스의 register 메서드가 DTO와 함께 호출되어야 한다', async () => {
      const registerDto: RegisterDto = {
        email: 'email@email.com',
        full_name: 'name',
        password: 'password',
      };
      const mockRegister = mockAuthService.register.mockResolvedValue();

      await controller.register(registerDto);

      expect(mockRegister).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('localLogin', () => {
    it('로그인에 성공하는 경우 액세스 토큰과 리프레시 토큰을 반환한다.', async () => {
      const requestUser = new RequestUser('test');

      const accessToken = 'access-token';
      const refreshToken = 'refresh-token';

      mockAuthService.generateAccessToken.mockResolvedValue(accessToken);
      mockAuthService.generateRefreshToken.mockResolvedValue(refreshToken);

      const token = await controller.localLogin(requestUser);

      expect(token.access_token).toEqual(accessToken);
      expect(token.refresh_token).toEqual(refreshToken);
    });
  });
});
