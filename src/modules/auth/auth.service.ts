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
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
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

  async generateAccessToken(id: string): Promise<string> {
    this.logger.debug('generateAccessToken');
    const accessToken = await this.jwtService.signAsync({ id });
    return accessToken;
  }
}
