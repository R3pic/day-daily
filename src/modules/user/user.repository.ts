import { TransactionHost } from '@nestjs-cls/transactional';
import { Injectable, Logger } from '@nestjs/common';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';

import { UserEntity } from '@user/entities';
import { UserRepositoryBase } from '@user/interfaces';

@Injectable()
export class UserRepository implements UserRepositoryBase {
  private readonly logger = new Logger(UserRepository.name);
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {}

  private get repository() {
    return this.txHost.tx.getRepository(UserEntity);
  }

  async save(userEntity: UserEntity): Promise<UserEntity> {
    this.logger.debug(`save: ${userEntity.email}`);
    return await this.repository.save(userEntity);
  }

  async findById(id: string): Promise<UserEntity | null> {
    this.logger.debug(`findById: ${id}`);
    return this.repository.findOne({
      where: {
        id,
      },
      relations: ['userSetting'],
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    this.logger.debug(`findByEmail: ${email}`);
    return this.repository.findOneBy({
      email,
    });
  }

  async existsByEmail(email: string): Promise<boolean> {
    this.logger.debug(`existsByEmail: ${email}`);
    return this.repository.existsBy({
      email,
    });
  }
}