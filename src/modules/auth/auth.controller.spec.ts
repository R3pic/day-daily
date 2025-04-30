import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { mock, MockProxy } from 'jest-mock-extended';
import { RegisterDto } from '@auth/dto';
import { RequestUser } from '@common/dto';
import { Response } from 'express';

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
    it('로그인에 성공하는 경우 액세스 토큰을 쿠키에 담아 반환한다.', async () => {
      const requestUser = new RequestUser('test');
      const res = mock<Response>();
      const mockCookie = res.cookie.mockReturnThis();

      const accessToken = 'jwt-token';

      const mockGenerateAccessToken = mockAuthService.generateAccessToken.mockResolvedValue(accessToken);

      await controller.localLogin(requestUser, res);

      expect(mockGenerateAccessToken).toHaveBeenCalledTimes(1);
      expect(mockCookie).toHaveBeenCalledWith('access_token', accessToken, expect.anything());
    });
  });
});
