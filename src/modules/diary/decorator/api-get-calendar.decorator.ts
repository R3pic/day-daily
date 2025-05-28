import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, getSchemaPath } from '@nestjs/swagger';
import { GetCalendarResponse } from '@diary/responses';

export function ApiGetCalendarResponse() {
  return applyDecorators(
    ApiOperation({ description: '일기를 작성한 날을 조회합니다. 각 배열의 요소는 1일 부터 1:1 매핑됩니다.' }),
    ApiOkResponse({ description: '요청에 성공했을 경우', schema: { $ref: getSchemaPath(GetCalendarResponse) } }),
  );
}