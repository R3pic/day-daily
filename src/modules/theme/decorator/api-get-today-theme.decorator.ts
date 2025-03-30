import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, getSchemaPath } from '@nestjs/swagger';
import { TodayThemeResponse } from '@theme/responses';

export function ApiGetTodayThemeResponses() {
  return applyDecorators(
    ApiOperation({ description: '오늘의 주제를 반환합니다.' }),
    ApiOkResponse({ description: '요청이 성공했을 경우', schema: { allOf: [{ $ref: getSchemaPath(TodayThemeResponse) }] } })
  );
}