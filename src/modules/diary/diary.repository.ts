import * as util from 'node:util';
import { Injectable, Logger } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';

import { DiaryRepositoryBase } from '@diary/interfaces';
import { DiaryEntity } from '@diary/entities';
import { FindManyOptions, Not } from 'typeorm';
import { RequestUser } from '@common/dto';

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

  async findByUserId(id: string, query: Pick<FindManyOptions, 'take' | 'skip'>) {
    this.logger.debug(`findByUserId: ${id}`);
    return this.repository.find({
      order: { createdAt: 'DESC' },
      skip: query.skip,
      take: query.take,
      where: {
        author: {
          id,
        },
      },
      relations: ['author'],
    });
  }

  async findPreviousDiariesWithoutTodayDiary(id: string, themeId: number, diaryId: string) {
    return this.repository.find({
      order: { createdAt: 'DESC' },
      where: {
        author: {
          id,
        },
        theme: {
          id: themeId,
        },
        id: Not(diaryId),
      },
      relations: ['author'],
    });
  }

  async findByRecent(
    requestUser: RequestUser | null,
    query: Pick<FindManyOptions, 'take' | 'skip'>
  ): Promise<DiaryEntity[]> {
    this.logger.debug('findByRecent');
    // return this.repository.find({
    //   order: { createdAt: 'DESC' },
    //   skip: query.skip,
    //   take: query.take,
    //   relations: ['author'],
    // });

    return this.repository
      .createQueryBuilder('diary')
      .leftJoinAndSelect('diary.author', 'author')
      .leftJoin('user_setting', 'userSetting', 'userSetting.user_id = author.id')
      .where('userSetting.hideDiaries = false')
      .andWhere('author.id != :requestUserId', { requestUserId: requestUser?.id ?? '' })
      .orderBy('diary.createdAt', 'DESC')
      .skip(query.skip)
      .take(query.take)
      .getMany();
  }

  async getCountByUserId(userId: string) {
    return this.repository.countBy({
      author: {
        id: userId,
      },
    });
  }

  async delete(diaryEntity: DiaryEntity): Promise<void>{
    this.logger.debug(`delete: ${util.inspect(diaryEntity)}`);
    await this.repository.delete({
      id: diaryEntity.id,
    });
  }
}