import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LoginDto } from '@auth/dto';

export function ApiLoginResponses() {
  return applyDecorators(
    ApiOperation({ summary: '로그인' }),
    ApiOkResponse({ description: '성공적으로 로그인됨' }),
    ApiUnauthorizedResponse({ description: '인증 실패' }),
    ApiBody({ type: LoginDto }),
  );
}