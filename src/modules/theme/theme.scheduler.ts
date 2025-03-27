import { CronJob } from 'cron';

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';

import { ThemeService } from '@theme/theme.service';
import { Environment, EnvironmentVariables } from '@common/env';

@Injectable()
export class ThemeScheduler implements OnModuleInit {
  private readonly logger = new Logger(ThemeScheduler.name);

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
    private readonly themeService: ThemeService,
  ) {}

  onModuleInit(): void {
    const environment = this.configService.get<Environment>('NODE_ENV');

    const cronExpression = environment === Environment.Development
      ? CronExpression.EVERY_MINUTE
      : CronExpression.EVERY_DAY_AT_4AM;

    const job = new CronJob(cronExpression, () => {
      void this.themeService.triggerUpdateTodayTheme();
    });

    this.schedulerRegistry.addCronJob('update-theme', job);
    job.start();
    this.logger.debug(`오늘의 주제 스케쥴러 실행 주기 : ${this.cronExpressionToString(cronExpression)}`);
  }

  private cronExpressionToString(cronExpression: CronExpression) {
    return Object.entries(CronExpression).find(([, v]) => v === cronExpression)?.[0];
  }
}