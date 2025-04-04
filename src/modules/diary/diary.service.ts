import * as util from 'node:util';
import { Injectable, Logger } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';

import { DiaryRepository } from '@diary/diary.repository';
import { ThemeService } from '@theme/theme.service';
import { DiaryMapper } from '@diary/diary.mapper';
import { DiaryEditExpiredException, DiaryNotFoundException } from '@diary/exceptions';
import {
  CreateDiaryDto,
  DeleteDiaryDto,
  DiaryDto,
  UpdateDiaryDto,
} from '@diary/dto';
import { DateUtil } from '@common/utils/date';

@Injectable()
export class DiaryService {
  private readonly logger = new Logger(DiaryService.name);

  constructor(
    private readonly themeService: ThemeService,
    private readonly diaryRepository: DiaryRepository,
  ) {}

  @Transactional()
  async create(createDiaryDto: CreateDiaryDto): Promise<DiaryDto> {
    this.logger.debug(`create: ${util.inspect(createDiaryDto)}`);
    const entity = DiaryMapper.toEntity(createDiaryDto);
    if (createDiaryDto.use_theme)
      entity.theme = this.themeService.getTodayTheme();

    const createdEntity = await this.diaryRepository.save(entity);
    return DiaryMapper.toDto(createdEntity);
  }

  @Transactional()
  async update(updateDiaryDto: UpdateDiaryDto): Promise<void> {
    this.logger.debug(`update: ${util.inspect(updateDiaryDto)}`);
    const diaryEntity = await this.diaryRepository.findById(updateDiaryDto.id);

    if (!diaryEntity) throw new DiaryNotFoundException(updateDiaryDto.id);
    if (DateUtil.hasExpired(diaryEntity.createdAt)) throw new DiaryEditExpiredException();

    const updateDiaryEntity = DiaryMapper.toEntity(updateDiaryDto);

    await this.diaryRepository.update(updateDiaryEntity);
  }

  async findByRecent(): Promise<DiaryDto[]> {
    this.logger.debug('findByRecent');

    const recentDiaries = await this.diaryRepository.findByRecent();

    return recentDiaries.map((diary) => DiaryMapper.toDto(diary));
  }

  @Transactional()
  async delete(deleteDiaryDto: DeleteDiaryDto): Promise<void> {
    this.logger.debug(`delete: ${util.inspect(deleteDiaryDto)}`);
    const isExist = await this.diaryRepository.isExist(deleteDiaryDto.id);

    if (!isExist) throw new DiaryNotFoundException(deleteDiaryDto.id);

    const diaryEntity = DiaryMapper.toEntity(deleteDiaryDto);
    await this.diaryRepository.delete(diaryEntity);
  }
}
