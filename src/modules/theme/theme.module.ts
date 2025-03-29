import { Module } from '@nestjs/common';

import { ThemeController } from '@theme/theme.controller';
import { ThemeService } from '@theme/theme.service';
import { ThemeScheduler } from '@theme/theme.scheduler';
import { ThemeRepository } from '@theme/theme.repository';
import { ThemeLogRepository } from '@theme/theme-log.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThemeEntity, ThemeLogEntity } from '@theme/entities';

@Module({
  imports: [TypeOrmModule.forFeature([ThemeEntity, ThemeLogEntity])],
  controllers: [ThemeController],
  providers: [
    ThemeService,
    ThemeRepository,
    ThemeLogRepository,
    ThemeScheduler,
  ],
  exports: [ThemeService],
})
export class ThemeModule {}
