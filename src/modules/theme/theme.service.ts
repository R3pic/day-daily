import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';

import { DateUtil } from '@common/utils/date';
import { ThemeRepository } from '@theme/theme.repository';
import { ThemeLogRepository } from '@theme/theme-log.repository';
import { ThemeEntity } from '@theme/entities';

@Injectable()
export class ThemeService implements OnModuleInit {
  private readonly logger = new Logger(ThemeService.name);
  private todayTheme: ThemeEntity;

  constructor(
    private readonly themeRepository: ThemeRepository,
    private readonly themeLogRepository: ThemeLogRepository,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.triggerUpdateTodayTheme();
  }

  getTodayTheme() {
    return this.todayTheme;
  }

  async getTodayThemeCount() {
    return await this.themeRepository.getUsedThemeCount(this.todayTheme);
  }

  @Transactional()
  async updateTodayTheme(): Promise<void> {
    this.logger.debug('updateTodayTheme');
    this.todayTheme = await this.themeRepository.getRandomTheme();
    await this.themeLogRepository.saveLog(this.todayTheme);
    this.logger.debug(`오늘의 새로운 주제 : ${this.todayTheme.text}`);
  }

  async triggerUpdateTodayTheme(): Promise<void> {
    this.logger.debug('새로운 주제 할당 스케쥴러 실행');
    const lastLog = await this.themeLogRepository.getLastLog();

    if (!lastLog) {
      await this.updateTodayTheme();
      return;
    }

    if (DateUtil.hasExpired(lastLog.loggedDate)) {
      this.logger.debug('마지막 로그가 만료되어 새로운 주제를 할당합니다.');
      await this.updateTodayTheme();
      return;
    } else if (!this.todayTheme) {
      this.logger.debug('메모리에 존재하지 않아 마지막 로그로부터 새로운 주제를 할당합니다.');
      const lastTheme = await this.themeRepository.findById(lastLog.theme.id);
      if (lastTheme) {
        this.todayTheme = lastTheme;
        this.logger.debug(`오늘의 주제 : ${this.todayTheme.text}`);
      }
    }
  }
}
