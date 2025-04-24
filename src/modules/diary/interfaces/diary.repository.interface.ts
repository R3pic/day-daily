import { DiaryEntity } from '@diary/entities';
import { FindManyOptions } from 'typeorm';

export interface DiaryRepositoryBase {
  save(diaryEntity: DiaryEntity): Promise<DiaryEntity>;
  findByRecent(query: Pick<FindManyOptions, 'skip' | 'take'>): Promise<DiaryEntity[]>;
}