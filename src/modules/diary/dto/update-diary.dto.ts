import {
  UpdateDiaryParam,
  UpdateDiaryBody,
} from '@diary/dto';

export class UpdateDiaryDto {
  id: string;
  title: string;
  content: string;

  static of(param: UpdateDiaryParam, body: UpdateDiaryBody) {
    const dto = new UpdateDiaryDto();
    dto.id = param.id;
    dto.title = body.title;
    dto.content = body.content;
    return dto;
  }
}