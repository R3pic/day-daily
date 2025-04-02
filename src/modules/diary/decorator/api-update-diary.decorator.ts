import { applyDecorators } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

export function ApiUpdateDiaryResponses() {
  return applyDecorators(
    ApiOperation({ description: '일기 제목 및 내용을 수정합니다.' }),
    ApiNoContentResponse({ description: '일기를 성공적으로 수정한 경우' }),
    ApiNotFoundResponse({ description: '해당 ID의 일기가 존재하지 않을 경우' }),
    ApiUnauthorizedResponse({ description: '인증되지 않은 사용자일 경우' }),
    ApiForbiddenResponse({ description: '자신의 일기가 아닌 다른 사람의 일기를 수정하려는 경우' }),
    ApiUnprocessableEntityResponse({ description: '오늘의 일기가 아닌 다른 날짜의 일기를 수정하려는 경우' })
  );
}