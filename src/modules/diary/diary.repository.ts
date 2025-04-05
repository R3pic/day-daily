import * as util from 'node:util';
import { Injectable, Logger } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';

import { DiaryRepositoryBase } from '@diary/interfaces';
import { DiaryEntity } from '@diary/entities';

@Injectable()
export class DiaryRepository implements DiaryRepositoryBase {
  private readonly logger = new Logger(DiaryRepository.name);
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {}

  private get repository() {
    return this.txHost.tx.getRepository(DiaryEntity);
  }

  async isExist(id: string): Promise<boolean> {
    this.logger.debug(`isExist: ${id}`);
    return this.repository.existsBy({ id });
  }

  async save(diaryEntity: DiaryEntity): Promise<DiaryEntity> {
    this.logger.debug(`save: ${util.inspect(diaryEntity)}`);
    return this.repository.save(diaryEntity);
  }

  async update(diaryEntity: DiaryEntity): Promise<void> {
    this.logger.debug(`update: ${util.inspect(diaryEntity)}`);
    const { id, title, content } = diaryEntity;
    await this.repository.createQueryBuilder()
      .update()
      .set({ title, content })
      .where('id = :id', { id })
      .execute();
  }

  async findById(id: string) {
    this.logger.debug(`findById: ${id}`);
    return this.repository.findOne({
      where: {
        id,
      },
      relations: ['author'],
    });
  }

  async findByUserId(id: string) {
    this.logger.debug(`findByUserId: ${id}`);
    return this.repository.find({
      where: {
        author: {
          id,
        },
      },
      relations: ['author'],
    });
  }

  async findByRecent(): Promise<DiaryEntity[]> {
    this.logger.debug('findByRecent');
    return this.repository.find({
      order: { createdAt: 'DESC' },
      take: 5,
      relations: ['author'],
    });
  }

  async delete(diaryEntity: DiaryEntity): Promise<void>{
    this.logger.debug(`delete: ${util.inspect(diaryEntity)}`);
    await this.repository.delete({
      id: diaryEntity.id,
    });
  }
}