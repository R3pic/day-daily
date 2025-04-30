import { Injectable, Logger } from '@nestjs/common';

import { UserEntity } from '@user/entities';
import { UserRepository } from '@user/user.repository';
import { UserNotFoundException } from '@user/exceptions';
import { CreateUserDto } from '@user/dto';
import { Transactional } from '@nestjs-cls/transactional';
import { UserMapper } from '@user/user.mapper';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  @Transactional()
  async save(createUserDto: CreateUserDto) {
    this.logger.debug(`create: ${createUserDto.email}`);
    const entity = UserMapper.toEntity(createUserDto);
    this.logger.debug(entity);
    await this.userRepository.save(entity);
  }

  async findById(id: string): Promise<UserEntity> {
    this.logger.debug(`findById: ${id}`);
    const user = await this.userRepository.findById(id);

    if (!user) throw new UserNotFoundException();

    return user;
  }

  async findByEmail(email: string): Promise<UserEntity> {
    this.logger.debug(`findByEmail: ${email}`);
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new UserNotFoundException();

    return user;
  }

  async existsByEmail(email: string): Promise<boolean> {
    this.logger.debug(`existsByEmail: ${email}`);
    return this.userRepository.existsByEmail(email);
  }
}
