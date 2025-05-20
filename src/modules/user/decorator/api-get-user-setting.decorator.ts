import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, getSchemaPath } from '@nestjs/swagger';
import { GetUserSettingResponse } from '@user/responses';

export function ApiGetUserSettingResponses() {
  return applyDecorators(
    ApiOperation({ description: '유저 개인 설정을 반환합니다.' }),
    ApiOkResponse({ description: '요청이 성공한 경우', schema: { $ref: getSchemaPath(GetUserSettingResponse) } })
  );
}