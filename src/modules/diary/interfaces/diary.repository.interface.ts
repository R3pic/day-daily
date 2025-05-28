import { DiaryEntity } from '@diary/entities';
import { FindManyOptions } from 'typeorm';
import { RequestUser } from '@common/dto';

export interface DiaryRepositoryBase {
  save(diaryEntity: DiaryEntity): Promise<DiaryEntity>;
  findByRecent(requestUser: RequestUser | null, query: Pick<FindManyOptions, 'skip' | 'take'>): Promise<DiaryEntity[]>;
}