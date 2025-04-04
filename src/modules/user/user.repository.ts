import { TransactionHost } from '@nestjs-cls/transactional';
import { Injectable, Logger } from '@nestjs/common';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';

import { UserEntity } from '@user/entities';
import { UserRepositoryBase } from '@user/interfaces';

@Injectable()
export class UserRepository implements UserRepositoryBase{
  private readonly logger = new Logger(UserRepository.name);
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {}

  private get repository() {
    return this.txHost.tx.getRepository(UserEntity);
  }

  findById(id: string): Promise<UserEntity | null> {
    this.logger.debug(`findById: ${id}`);
    return this.repository.findOneBy({
      id,
    });
  }
}