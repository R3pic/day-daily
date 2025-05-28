import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, getSchemaPath } from '@nestjs/swagger';
import { GetUserInfoResponse } from '@user/responses';

export function ApiGetUserInfoResponse() {
  return applyDecorators(
    ApiOperation({ description: '현재 로그인된 사용자의 정보를 가져옵니다.' }),
    ApiOkResponse({ description: '요청에 성공했을 경우', schema: { $ref: getSchemaPath(GetUserInfoResponse) } }),
  );
}