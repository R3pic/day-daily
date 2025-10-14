import { applyDecorators } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

export function ApiCheckEmailResponses() {
  return applyDecorators(
    ApiOperation({ description: '이메일이 존재하는지 확인합니다.' }),
    ApiOkResponse({ description: '이메일이 존재하지 않는 경우' }),
    ApiConflictResponse({ description: '이메일이 중복인 경우' }),
  );
}