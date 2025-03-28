import { applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';

import { CreateDiaryResponse } from '@diary/responses';

export function ApiCreateDiaryResponses() {
  return applyDecorators(
    ApiOperation({ description: '일기를 생성합니다.' }),
    ApiCreatedResponse({ description: '일기 생성에 성공했을 경우', schema: { $ref: getSchemaPath(CreateDiaryResponse) } }),
  );
}