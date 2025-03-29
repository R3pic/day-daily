import { Injectable, Logger } from '@nestjs/common';
import { DiaryRepository } from '@diary/diary.repository';
import { ThemeService } from '@theme/theme.service';
import { DiaryMapper } from '@diary/diary.mapper';
import { CreateDiaryDto } from '@diary/dto/create-diary.dto';
import { DiaryDto } from '@diary/dto/diary.dto';
import { QueryRunnerFactory } from '@database/query-runner.factory';

@Injectable()
export class DiaryService {
  private readonly logger = new Logger(DiaryService.name);

  constructor(
    private readonly themeService: ThemeService,
    private readonly diaryRepository: DiaryRepository,
    private readonly queryRunnerFactory: QueryRunnerFactory,
  ) {}

  async create(createDiaryDto: CreateDiaryDto): Promise<DiaryDto> {
    const queryRunner = this.queryRunnerFactory.create();
    await queryRunner.connect();

    await queryRunner.startTransaction();
    try {
      this.logger.log(`create : ${createDiaryDto.title}`);
      const entity = DiaryMapper.createDtoToEntity(createDiaryDto);

      if (createDiaryDto.use_theme)
        entity.theme_id = this.themeService.getTodayTheme().id;

      const createdEntity = await this.diaryRepository.save(entity);
      return DiaryMapper.toDto(createdEntity);
    } catch (e) {
      if(e instanceof Error) this.logger.error(e.message);
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
}
