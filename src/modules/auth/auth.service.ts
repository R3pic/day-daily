import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

import { UserService } from '@user/user.service';
import { RegisterDto } from '@auth/dto';
import { DuplicatedEmailException } from '@auth/exceptions';
import { CreateUserDto } from '@user/dto';
import { HashService } from '@auth/hash.service';
import { Transactional } from '@nestjs-cls/transactional';
import { RequestUser } from '@common/dto';
import { UserNotFoundException } from '@user/exceptions';
import { CredentialException } from '@auth/exceptions/credential.exception';
import { TokenService } from '@auth/token.service';
import { AuthRepository } from '@auth/auth.repository';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
  ) {}

  @Transactional()
  async register(registerDto: RegisterDto) {
    this.logger.debug(`register: ${registerDto.email}`);
    const isDuplicated = await this.userService.existsByEmail(registerDto.email);

    if (isDuplicated) throw new DuplicatedEmailException();

    const createUserDto = CreateUserDto.of(registerDto);

    createUserDto.password = await this.hashService.hash(createUserDto.password);

    await this.userService.save(createUserDto);
  }

  async validateLogin(email: string, password: string): Promise<RequestUser | null> {
    try {
      this.logger.debug('validateLogin');
      const user = await this.userService.findByEmail(email);

      const isEqualPassword = await this.hashService.compare(password, user.password);

      if (!isEqualPassword) return null;

      return new RequestUser(user.id);
    } catch (e) {
      this.logger.error(e);
      if (e instanceof UserNotFoundException) throw new CredentialException();

      throw new InternalServerErrorException();
    }
  }

  @Transactional()
  async localLogin(requestUser: RequestUser) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.generateAccessToken(requestUser.id),
      this.tokenService.generateRefreshToken(requestUser.id),
    ]);

    await this.authRepository.saveRefreshToken(requestUser.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async generateAccessToken(requestUser: RequestUser): Promise<string> {
    return this.tokenService.generateAccessToken(requestUser.id);
  }

  async generateRefreshToken(requestUser: RequestUser): Promise<string> {
    return this.tokenService.generateRefreshToken(requestUser.id);
  }

  async logout(reqUser?: RequestUser) {
    if (reqUser)
      await this.authRepository.clearRefreshToken(reqUser.id);
  }
}
