import {
  Controller,
  Get,
  HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';

import { ThemeService } from '@theme/theme.service';
import { TodayThemeResponse } from '@theme/responses';
import { ApiGetTodayThemeResponses } from '@theme/decorator';

@ApiTags('Theme')
@ApiExtraModels(TodayThemeResponse)
@Controller('themes')
export class ThemeController {
  constructor(
    private readonly themeService: ThemeService,
  ) {}

  @Get('today')
  @HttpCode(HttpStatus.OK)
  @ApiGetTodayThemeResponses()
  today(): TodayThemeResponse {
    const { text } = this.themeService.getTodayTheme();

    return {
      theme: text,
    };
  }
}
