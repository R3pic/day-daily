import { Injectable } from '@nestjs/common';

import { DiaryRepositoryBase } from '@diary/interfaces/diary.repository.interface';
import { DiaryEntity } from '@diary/entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DiaryRepository implements DiaryRepositoryBase {
  constructor(
    @InjectRepository(DiaryEntity)
    private readonly repository: Repository<DiaryEntity>,
  ) {}

  async save(diaryEntity: DiaryEntity): Promise<DiaryEntity> {
    return this.repository.save(diaryEntity);
  }

  async findByRecent(): Promise<DiaryEntity[]> {
    return this.repository.find({
      order: { createdAt: 'DESC' },
      take: 5,
    });
  }
}