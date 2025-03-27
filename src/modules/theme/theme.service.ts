import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { hasTimePassed } from '@common/utils/date';
import { ThemeEntity } from '@theme/entities/theme.entity';
import { ThemeRepository } from '@theme/theme.repository';
import { ConfigService } from '@nestjs/config';
import { Environment, EnvironmentVariables } from '@common/env';


@Injectable()
export class ThemeService implements OnModuleInit {
  private readonly logger = new Logger(ThemeService.name);
  private todayTheme: ThemeEntity;

  constructor(
    private readonly themeRepository: ThemeRepository,
    private readonly configService: ConfigService<EnvironmentVariables, true>
  ) {}

  async onModuleInit(): Promise<void> {
    await this.triggerUpdateTodayTheme();
  }

  getTodayTheme(): string {
    return this.todayTheme.text;
  }

  async updateTodayTheme(): Promise<void> {
    this.todayTheme = await this.themeRepository.getRandomTheme();
    await this.themeRepository.saveLog(this.todayTheme);
    this.logger.debug(`오늘의 새로운 주제 : ${this.todayTheme.text}`);
  }

  async triggerUpdateTodayTheme(): Promise<void> {
    this.logger.debug('새로운 주제 할당 스케쥴러 실행');
    const lastLog = await this.themeRepository.getLastLog();

    if (!lastLog) {
      await this.updateTodayTheme();
      return;
    }

    const isAfter = () => this.configService.get<Environment>('NODE_ENV') === Environment.Development
      ? hasTimePassed(lastLog.created_at, 'minute', 1)
      : hasTimePassed(lastLog.created_at, 'day', 1);

    if (isAfter()) {
      await this.updateTodayTheme();
      return;
    }

    this.logger.debug('마지막 로그로부터 새로운 주제를 할당합니다.');
    const lastTheme = await this.themeRepository.findById(lastLog.theme_id);
    if (lastTheme) {
      this.todayTheme = lastTheme;
      this.logger.debug(`오늘의 주제 : ${this.todayTheme.text}`);
    }
  }
}
