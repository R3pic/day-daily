import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation, getSchemaPath,
} from '@nestjs/swagger';
import { GetDiaryByUserResponse } from '@diary/responses';

export function ApiGetByUserResponses() {
  return applyDecorators(
    ApiOperation({ description: '사용자가 작성한 일기 목록을 반환합니다.' }),
    ApiOkResponse({ description: '요청이 성공했을 경우', schema: { $ref: getSchemaPath(GetDiaryByUserResponse) } }),
    ApiBadRequestResponse({ description: '요청 형식이 잘못된 경우' }),
    ApiNotFoundResponse({ description: '존재하지 않는 유저인 경우' }),
    ApiForbiddenResponse({ description: '일기를 숨김으로 한 사용자일 경우' })
  );
}