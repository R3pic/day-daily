import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

export function ApiPatchMeProfileResponses() {
  return applyDecorators(
    ApiOperation({ description: '현재 로그인한 유저의 프로필 아바타를 수정합니다.' }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: '업로드할 아바타 이미지 파일',
      required: true,
      schema: {
        type: 'object',
        properties: {
          avatar: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
    ApiOkResponse({ description: '요청에 성공했을 경우' }),
  );
}