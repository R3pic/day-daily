import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DiaryRepositoryBase } from '@diary/interfaces';
import { DiaryEntity } from '@diary/entities';

@Injectable()
export class DiaryRepository implements DiaryRepositoryBase {
  constructor(
    @InjectRepository(DiaryEntity)
    private readonly repository: Repository<DiaryEntity>,
  ) {}

  async isExist(id: string): Promise<boolean> {
    return this.repository.existsBy({ id });
  }

  async save(diaryEntity: DiaryEntity): Promise<DiaryEntity> {
    return this.repository.save(diaryEntity);
  }

  async findByRecent(): Promise<DiaryEntity[]> {
    return this.repository.find({
      order: { createdAt: 'DESC' },
      take: 5,
    });
  }

  async delete(diaryEntity: DiaryEntity): Promise<void>{
    await this.repository.delete({
      id: diaryEntity.id,
    });
  }
}