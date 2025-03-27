import { Module } from '@nestjs/common';

import { ThemeController } from '@theme/theme.controller';
import { ThemeService } from '@theme/theme.service';
import { ThemeScheduler } from '@theme/theme.scheduler';
import { ThemeRepository } from '@theme/theme.repository';

@Module({
  controllers: [ThemeController],
  providers: [
    ThemeService,
    ThemeRepository,
    ThemeScheduler,
  ],
  exports: [ThemeService],
})
export class ThemeModule {}
