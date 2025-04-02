import { Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DiaryRepositoryBase } from '@diary/interfaces';
import { DiaryEntity } from '@diary/entities';

@Injectable()
export class DiaryRepository implements DiaryRepositoryBase {
  private readonly logger = new Logger(DiaryRepository.name);
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

  async update(diaryEntity: DiaryEntity): Promise<void> {
    const { id, title, content } = diaryEntity;

    const queryBuilder = this.repository.createQueryBuilder()
      .update()
      .set({ title, content })
      .where('id = :id', { id });
    await queryBuilder.execute();
  }

  async findById(id: string) {
    return this.repository.findOneBy({
      id,
    });
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