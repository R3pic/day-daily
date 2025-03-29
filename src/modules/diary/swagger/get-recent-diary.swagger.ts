import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';

import { GetRecentDiaryResponse } from '@diary/responses';

export function ApiGetRecentDiaryResponses() {
  return applyDecorators(
    ApiOperation({ description: '가장 최근에 작성된 일기를 반환합니다.' }),
    ApiOkResponse({ description: '요청이 성공 했을 경우', schema: { $ref: getSchemaPath(GetRecentDiaryResponse) } }),
  );
}