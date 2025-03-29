import { Injectable, Logger } from '@nestjs/common';
import { DiaryRepository } from '@diary/diary.repository';
import { ThemeService } from '@theme/theme.service';
import { DiaryMapper } from '@diary/diary.mapper';
import { CreateDiaryDto } from '@diary/dto/create-diary.dto';
import { DiaryDto } from '@diary/dto/diary.dto';

@Injectable()
export class DiaryService {
  private readonly logger = new Logger(DiaryService.name);

  constructor(
    private readonly themeService: ThemeService,
    private readonly diaryRepository: DiaryRepository,
  ) {}

  async create(createDiaryDto: CreateDiaryDto): Promise<DiaryDto> {
    this.logger.log(`create : ${createDiaryDto.title}`);
    const entity = DiaryMapper.createDtoToEntity(createDiaryDto);

    if (createDiaryDto.use_theme)
      entity.theme_id = this.themeService.getTodayTheme().id;

    const createdEntity = await this.diaryRepository.save(entity);
    return DiaryMapper.toDto(createdEntity);
  }

  async findByRecent(): Promise<DiaryDto[]> {
    this.logger.log('findByRecent');

    const recentDiaries = await this.diaryRepository.findByRecent();

    return recentDiaries.map((diary) => DiaryMapper.toDto(diary));
  }
}
