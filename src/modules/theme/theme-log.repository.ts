import { Injectable, Logger } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';

import { ThemeLogRepositoryBase } from '@theme/interface';
import { ThemeEntity, ThemeLogEntity } from '@theme/entities';
import * as util from 'node:util';

@Injectable()
export class ThemeLogRepository implements ThemeLogRepositoryBase {
  private readonly logger = new Logger(ThemeLogRepository.name);

  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {}

  private get repository() {
    return this.txHost.tx.getRepository(ThemeLogEntity);
  }

  async saveLog(themeEntity: ThemeEntity): Promise<void> {
    this.logger.debug(`saveLog: ${util.inspect(themeEntity)}`);
    await this.repository.save({ theme: themeEntity });
  }

  async getLastLog(): Promise<ThemeLogEntity | null> {
    this.logger.debug('getLastLog');
    const [log] = await this.repository.find({
      order: { id: 'DESC' },
      take: 1,
      relations: ['theme'],
    });

    return log ?? null;
  }
}