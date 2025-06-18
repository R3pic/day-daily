import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

export function ApiGetAvatarResponses() {
  return applyDecorators(
    ApiOperation({ description: '사용자 프로필 아바타 이미지를 반환합니다.' }),
    ApiOkResponse({
      description: '요청이 성공한 경우',
      content: {
        'image/*': {
          schema: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
  );
}