import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

export function ApiPatchUserSettingResponses() {
  return applyDecorators(
    ApiOperation({ description: '유저 개인 설정을 수정합니다.' }),
    ApiOkResponse({ description: '요청이 성공한 경우' }),
    ApiBadRequestResponse({ description: '요청 필드가 잘못된 경우' }),
  );
}