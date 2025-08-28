import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation, getSchemaPath,
} from '@nestjs/swagger';
import { GetUserResponse } from '@user/responses';

export function ApiGetUserResponses() {
  return applyDecorators(
    ApiOperation({ description: '사용자의 정보를 반환합니다.' }),
    ApiOkResponse({ description: '요청이 성공했을 경우', schema: { $ref: getSchemaPath(GetUserResponse) } }),
    ApiBadRequestResponse({ description: '요청 형식이 잘못된 경우' }),
    ApiNotFoundResponse({ description: '존재하지 않는 유저인 경우' }),
  );
}