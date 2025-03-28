import {
  Controller,
  Get,
  HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';

import { ThemeService } from '@theme/theme.service';
import { TodayThemeResponse } from '@theme/responses';
import { ApiTodayResponses } from '@theme/swagger';

@ApiTags('Theme')
@ApiExtraModels(TodayThemeResponse)
@Controller('theme')
export class ThemeController {
  constructor(
    private readonly themeService: ThemeService,
  ) {}

  @Get('today')
  @HttpCode(HttpStatus.OK)
  @ApiTodayResponses()
  today(): TodayThemeResponse {
    const { text } = this.themeService.getTodayTheme();

    return {
      theme: text,
    };
  }
}
