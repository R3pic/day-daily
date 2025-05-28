import { Injectable, Logger } from '@nestjs/common';

import { UserEntity } from '@user/entities';
import { UserRepository } from '@user/user.repository';
import { UserNotFoundException } from '@user/exceptions';
import { CreateUserDto, UpdatePasswordDto } from '@user/dto';
import { Transactional } from '@nestjs-cls/transactional';
import { UserMapper } from '@user/user.mapper';
import { UserSettingService } from '@user/user-setting.service';
import { CredentialException } from '@auth/exceptions';
import { HashService } from '@auth/hash.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private readonly hashService: HashService,
    private readonly userSettingService: UserSettingService,
    private readonly userRepository: UserRepository,
  ) {}

  @Transactional()
  async save(createUserDto: CreateUserDto) {
    this.logger.debug(`create: ${createUserDto.email}`);
    const entity = UserMapper.toEntity(createUserDto);
    this.logger.debug(entity);
    const { id } = await this.userRepository.save(entity);
    await this.userSettingService.save({ userId: id });
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

  async existsById(id: string): Promise<boolean> {
    this.logger.debug(`existsById: ${id}`);
    return this.userRepository.existsById(id);
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto): Promise<void> {
    this.logger.debug(`updatePassword: ${updatePasswordDto.requestUser.id}`);
    const user = await this.findById(updatePasswordDto.requestUser.id);

    const isEqual = await this.hashService.compare(updatePasswordDto.beforePassword, user.password);

    if (!isEqual) throw new CredentialException();

    const newPassword = await this.hashService.hash(updatePasswordDto.newPassword);

    const updateEntity = new UserEntity();

    updateEntity.id = user.id;
    updateEntity.password = newPassword;

    await this.userRepository.update(updateEntity);
  }
}
