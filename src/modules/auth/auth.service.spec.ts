import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { HashService } from '@auth/hash.service';
import { mock, MockProxy } from 'jest-mock-extended';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@user/user.service';
import { RegisterDto } from '@auth/dto';
import { CreateUserDto } from '@user/dto';
import { CredentialException, DuplicatedEmailException } from '@auth/exceptions';
import { UserEntity } from '@user/entities';
import { UserNotFoundException } from '@user/exceptions';
import { RequestUser } from '@common/dto';

describe('AuthService', () => {
  let service: AuthService;
  let userService: MockProxy<UserService>;
  let hashService: MockProxy<HashService>;
  let jwtService: MockProxy<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        HashService,
        JwtService,
      ],
    })
      .overrideProvider(UserService)
      .useValue(mock<UserService>())
      .overrideProvider(HashService)
      .useValue(mock<HashService>())
      .overrideProvider(JwtService)
      .useValue(mock<JwtService>())
      .compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get(UserService);
    hashService = module.get(HashService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('회원가입 요청 시 사용자 정보를 이용해 회원가입에 성공한다', async () => {
      userService.existsByEmail.mockResolvedValue(false);
      hashService.hash.mockResolvedValue('hashed');
      const mockSave = userService.save.mockResolvedValue();
      const registerDto: RegisterDto = {
        email: 'email@email.com',
        full_name: 'fullName',
        password: 'password',
      };
      const createUserDto: CreateUserDto = CreateUserDto.of({ ...registerDto, password: 'hashed' });

      await service.register(registerDto);

      expect(mockSave).toHaveBeenCalledWith(createUserDto);
    });

    it('동일한 이메일이 존재하는 경우 DuplicateEmailException 예외가 발생한다', async () => {
      userService.existsByEmail.mockResolvedValue(true);
      const registerDto: RegisterDto = {
        email: 'email@email.com',
        full_name: 'fullName',
        password: 'password',
      };

      await expect(service.register(registerDto)).rejects.toThrow(DuplicatedEmailException);
    });
  });

  describe('validateLogin', () => {
    it('존재하는 이메일과 올바른 비밀번호로 로그인에 성공한다', async () => {
      const user: UserEntity = UserEntity.of({
        id: 'uuid',
        email: 'email@email.com',
        password: 'hashed',
      });
      const email = 'email@email.com';
      const password = 'password';

      userService.findByEmail.mockResolvedValue(user);
      hashService.compare.mockResolvedValue(true);

      const result = await service.validateLogin(email, password);

      expect(result).toEqual({ id: user.id }); // 또는 RequestUser 형태로 검사
    });

    it('존재하지 않는 이메일인 경우 CredentialException 예외가 발생한다', async () => {
      const email = 'email@email.com';
      const password = 'password';

      userService.findByEmail.mockRejectedValue(new UserNotFoundException());

      await expect(service.validateLogin(email, password)).rejects.toThrow(CredentialException);
    });

    it('비밀번호가 올바르지 않은 경우 null 을 반환한다', async () => {
      const user: UserEntity = UserEntity.of({
        id: 'uuid',
        email: 'email@email.com',
        password: 'hashed',
      });
      const email = 'email@email.com';
      const password = 'password';

      userService.findByEmail.mockResolvedValue(user);
      hashService.compare.mockResolvedValue(false);

      const requestUser = await service.validateLogin(email, password);
      expect(requestUser).toBeNull();
    });
  });

  describe('generateAccessToken', () => {
    it('액세스 토큰을 생성한다.', async () => {
      const mockSign = jwtService.signAsync.mockResolvedValue('token');
      const requestUser: RequestUser = {
        id: 'uuid',
      };
      const token = await service.generateAccessToken(requestUser);

      expect(mockSign).toHaveBeenCalledTimes(1);
      expect(token).toEqual('token');
    });
  });

});
