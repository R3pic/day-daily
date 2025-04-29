import { Injectable, Logger } from '@nestjs/common';

import { UserService } from '@user/user.service';
import { RegisterDto } from '@auth/dto';
import { DuplicatedEmailException } from '@auth/exceptions';
import { CreateUserDto } from '@user/dto';
import { HashService } from '@auth/hash.service';
import { Transactional } from '@nestjs-cls/transactional';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashService,
  ) {}

  @Transactional()
  async register(registerDto: RegisterDto) {
    this.logger.debug(`register: ${registerDto.email}`);
    const isDuplicated = await this.userService.existsByEmail(registerDto.email);

    if (isDuplicated) throw new DuplicatedEmailException();

    const createUserDto = CreateUserDto.of(registerDto);

    createUserDto.password = await this.hashService.hash(createUserDto.password);
    this.logger.debug(createUserDto);

    await this.userService.save(createUserDto);
  }
}
