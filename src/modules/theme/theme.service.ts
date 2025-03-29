import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Environment, EnvironmentVariables } from '@common/env';
import { hasTimePassed } from '@common/utils/date';
import { ThemeRepository } from '@theme/theme.repository';
import { ThemeLogRepository } from '@theme/theme-log.repository';
import { ThemeEntity } from '@theme/entities';
import { QueryRunnerFactory } from '@database/query-runner.factory';

@Injectable()
export class ThemeService implements OnModuleInit {
  private readonly logger = new Logger(ThemeService.name);
  private todayTheme: ThemeEntity;

  constructor(
    private readonly themeRepository: ThemeRepository,
    private readonly themeLogRepository: ThemeLogRepository,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
    private readonly queryRunnerFactory: QueryRunnerFactory,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.triggerUpdateTodayTheme();
  }

  getTodayTheme(): ThemeEntity {
    return this.todayTheme;
  }

  async updateTodayTheme(): Promise<void> {
    const queryRunner = this.queryRunnerFactory.create();
    await queryRunner.connect();

    await queryRunner.startTransaction();
    try {
      this.todayTheme = await this.themeRepository.getRandomTheme();
      await this.themeLogRepository.saveLog(this.todayTheme);
      this.logger.debug(`오늘의 새로운 주제 : ${this.todayTheme.text}`);
      await queryRunner.commitTransaction();
    } catch (e) {
      if (e instanceof Error) this.logger.error(e.message);
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async triggerUpdateTodayTheme(): Promise<void> {
    this.logger.debug('새로운 주제 할당 스케쥴러 실행');
    const lastLog = await this.themeLogRepository.getLastLog();

    if (!lastLog) {
      await this.updateTodayTheme();
      return;
    }

    const isAfter = () => this.configService.get<Environment>('NODE_ENV') === Environment.Development
      ? hasTimePassed(lastLog.loggedDate, 'minute', 1)
      : hasTimePassed(lastLog.loggedDate, 'day', 1);

    if (isAfter()) {
      await this.updateTodayTheme();
      return;
    }

    this.logger.debug('마지막 로그로부터 새로운 주제를 할당합니다.');
    const lastTheme = await this.themeRepository.findById(lastLog.theme.id);
    if (lastTheme) {
      this.todayTheme = lastTheme;
      this.logger.debug(`오늘의 주제 : ${this.todayTheme.text}`);
    }
  }
}
