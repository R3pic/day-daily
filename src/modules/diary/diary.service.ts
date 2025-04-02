import { Injectable, Logger } from '@nestjs/common';

import { DiaryRepository } from '@diary/diary.repository';
import { ThemeService } from '@theme/theme.service';
import { QueryRunnerFactory } from '@database/query-runner.factory';
import { DiaryMapper } from '@diary/diary.mapper';
import { DiaryEditExpiredException, DiaryNotFoundException } from '@diary/exceptions';
import {
  CreateDiaryDto,
  DeleteDiaryDto,
  DiaryDto, UpdateDiaryDto,
} from '@diary/dto';
import { DateUtil } from '@common/utils/date';

@Injectable()
export class DiaryService {
  private readonly logger = new Logger(DiaryService.name);

  constructor(
    private readonly themeService: ThemeService,
    private readonly diaryRepository: DiaryRepository,
    private readonly queryRunnerFactory: QueryRunnerFactory,
  ) {}

  async create(createDiaryDto: CreateDiaryDto): Promise<DiaryDto> {
    this.logger.log(`create : ${createDiaryDto.title}`);
    const queryRunner = this.queryRunnerFactory.create();
    await queryRunner.connect();

    await queryRunner.startTransaction();
    try {
      const entity = DiaryMapper.toEntity(createDiaryDto);
      if (createDiaryDto.use_theme)
        entity.theme = this.themeService.getTodayTheme();

      const createdEntity = await this.diaryRepository.save(entity);
      return DiaryMapper.toDto(createdEntity);
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async update(updateDiaryDto: UpdateDiaryDto): Promise<void> {
    this.logger.log('update');

    const queryRunner = this.queryRunnerFactory.create();
    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const diaryEntity = await this.diaryRepository.findById(updateDiaryDto.id);

      if (!diaryEntity) throw new DiaryNotFoundException(updateDiaryDto.id);
      if (DateUtil.hasExpired(diaryEntity.createdAt)) throw new DiaryEditExpiredException();

      const updateDiaryEntity = DiaryMapper.toEntity(updateDiaryDto);

      await this.diaryRepository.update(updateDiaryEntity);
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async findByRecent(): Promise<DiaryDto[]> {
    this.logger.log('findByRecent');

    const recentDiaries = await this.diaryRepository.findByRecent();

    return recentDiaries.map((diary) => DiaryMapper.toDto(diary));
  }

  async delete(deleteDiaryDto: DeleteDiaryDto): Promise<void> {
    this.logger.log('delete');
    const queryRunner = this.queryRunnerFactory.create();
    await queryRunner.connect();

    await queryRunner.startTransaction();
    try {
      const isExist = await this.diaryRepository.isExist(deleteDiaryDto.id);
      if (!isExist) throw new DiaryNotFoundException(deleteDiaryDto.id);
      const diaryEntity = DiaryMapper.toEntity(deleteDiaryDto);
      await this.diaryRepository.delete(diaryEntity);
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
