import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DiaryEntity } from '@diary/entities';
import { GetCalendarQuery } from '@diary/dto';
import { Injectable, Logger } from '@nestjs/common';
import { DateUtil } from '@common/utils/date';

type RawDay = { day: number };

@Injectable()
export class DiaryCalendarRepository {
  private readonly logger = new Logger(DiaryCalendarRepository.name);

  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {}

  private get repository() {
    return this.txHost.tx.getRepository(DiaryEntity);
  }

  async findWrittenDays(id: string, query: GetCalendarQuery): Promise<Set<number>> {
    this.logger.debug(`findWrittenDays ${query.year}-${query.month}`);
    const startDate = DateUtil.fromString(`${query.year}-${query.month}-01`);
    const endDate = startDate.endOf('month');

    // DATE 기반 조회
    const queryBuilder = this.repository
      .createQueryBuilder('diary')
      .select('DAY(diary.createdAt)', 'day')
      .where('diary.author = :id', { id })
      .andWhere('diary.createdAt BETWEEN :start AND :end', { start: startDate.toDate(), end: endDate.toDate() })
      .orderBy('day', 'ASC');

    // 함수 사용 조회
    // const qb = this.repository
    //   .createQueryBuilder('diary')
    //   .select('DAY(diary.createdAt)', 'day')
    //   .where('diary.author = :id', { id })
    //   .andWhere('YEAR(diary.createdAt) = :year', { year: query.year })
    //   .andWhere('MONTH(diary.createdAt) = :month', { month: query.month })
    //   .orderBy('day', 'ASC');

    const result = await queryBuilder.getRawMany<RawDay>();

    return new Set(result.map((row) => Number(row.day)));
  }
}