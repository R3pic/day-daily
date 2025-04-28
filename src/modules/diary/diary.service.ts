import * as util from 'node:util';
import { Injectable, Logger } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';

import { DateUtil } from '@common/utils/date';
import { PaginationQuery } from '@common/dto';
import { ThemeService } from '@theme/theme.service';
import { DiaryRepository } from '@diary/diary.repository';
import { DiaryMapper } from '@diary/diary.mapper';
import {
  DiaryEditExpiredException,
  DiaryForbiddenException,
  DiaryNotFoundException,
} from '@diary/exceptions';
import {
  CreateDiaryDto,
  DeleteDiaryDto,
  DiaryDto,
  UpdateDiaryDto,
} from '@diary/dto';
import { UserService } from '@user/user.service';

const MOCK_USER = '3997d213-112a-11f0-b5c6-0242ac120002';

@Injectable()
export class DiaryService {
  private readonly logger = new Logger(DiaryService.name);

  constructor(
    private readonly themeService: ThemeService,
    private readonly userService: UserService,
    private readonly diaryRepository: DiaryRepository,
  ) {}

  @Transactional()
  async create(createDiaryDto: CreateDiaryDto): Promise<DiaryDto> {
    this.logger.debug(`create: ${util.inspect(createDiaryDto)}`);
    const user = await this.userService.findById(MOCK_USER);
    const entity = DiaryMapper.toEntity(createDiaryDto);

    entity.author = user;

    if (createDiaryDto.use_theme)
      entity.theme = this.themeService.getTodayTheme();

    const createdEntity = await this.diaryRepository.save(entity);
    return DiaryMapper.toDto(createdEntity);
  }

  @Transactional()
  async update(updateDiaryDto: UpdateDiaryDto): Promise<void> {
    this.logger.debug(`update: ${util.inspect(updateDiaryDto)}`);
    const user = await this.userService.findById(MOCK_USER);

    const diaryEntity = await this.diaryRepository.findById(updateDiaryDto.id);

    if (!diaryEntity) throw new DiaryNotFoundException(updateDiaryDto.id);
    if (diaryEntity.author.id !== user.id) throw new DiaryForbiddenException();
    if (DateUtil.hasExpired(diaryEntity.createdAt)) throw new DiaryEditExpiredException();

    const updateDiaryEntity = DiaryMapper.toEntity(updateDiaryDto);

    await this.diaryRepository.update(updateDiaryEntity);
  }

  async findManyByUserId(id: string, query?: PaginationQuery): Promise<DiaryDto[]> {
    this.logger.debug(`findManyByUserId: ${id}`);
    const user = await this.userService.findById(id);

    const diaries = await this.diaryRepository.findByUserId(user.id, {
      skip: query?.offset,
      take: query?.limit,
    });

    return diaries.map((diary) => DiaryMapper.toDto(diary));
  }

  async findByRecent(query?: PaginationQuery): Promise<DiaryDto[]> {
    this.logger.debug('findByRecent');

    const recentDiaries = await this.diaryRepository.findByRecent({
      skip: query?.offset,
      take: query?.limit,
    });

    return recentDiaries.map((diary) => DiaryMapper.toDto(diary));
  }

  @Transactional()
  async delete(deleteDiaryDto: DeleteDiaryDto): Promise<void> {
    this.logger.debug(`delete: ${util.inspect(deleteDiaryDto)}`);

    const user = await this.userService.findById(MOCK_USER);
    const diary = await this.diaryRepository.findById(deleteDiaryDto.id);

    if (!diary) throw new DiaryNotFoundException(deleteDiaryDto.id);
    if (diary.author.id !== user.id) throw new DiaryForbiddenException();

    await this.diaryRepository.delete(diary);
  }
}
