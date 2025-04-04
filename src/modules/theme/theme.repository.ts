import { Injectable, Logger } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';

import { ThemeRepositoryBase } from '@theme/interface';
import { ThemeEntity } from '@theme/entities';

@Injectable()
export class ThemeRepository implements ThemeRepositoryBase {
  private readonly logger = new Logger(ThemeRepository.name);
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {}

  private get repository() {
    return this.txHost.tx.getRepository(ThemeEntity);
  }

  findById(id: number): Promise<ThemeEntity | null> {
    this.logger.debug(`findById: ${id}`);
    return this.repository.findOneBy({
      id,
    });
  }

  getRandomTheme(): Promise<ThemeEntity> {
    this.logger.debug('getRandomTheme');
    const queryBuilder = this.repository.createQueryBuilder()
      .select()
      .orderBy('RAND()')
      .limit(1);

    return queryBuilder.getOneOrFail();
  }
}