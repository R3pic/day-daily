import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, getSchemaPath } from '@nestjs/swagger';
import { GetMeResponse } from '@me/resposnes';

export function ApiGetMeResponses() {
  return applyDecorators(
    ApiOperation({ description: '현재 로그인한 유저의 정보를 가져옵니다.' }),
    ApiOkResponse({ description: '요청에 성공했을 경우', schema: { $ref: getSchemaPath(GetMeResponse) } }),
  );
}