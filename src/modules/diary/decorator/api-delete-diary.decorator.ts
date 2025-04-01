import { applyDecorators } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiDeleteDiaryResponses() {
  return applyDecorators(
    ApiOperation({ description: '일기를 삭제합니다.' }),
    ApiNoContentResponse({ description: '성공적으로 삭제했을경우' }),
    ApiNotFoundResponse({ description: '해당 ID의 일기가 존재하지 않을 경우' }),
    ApiUnauthorizedResponse({ description: '인증되지 않은 사용자일 경우' }),
    ApiForbiddenResponse({ description: '자신의 일기가 아닌 다른 사람의 일기를 삭제하려는 경우' }),
  );
}