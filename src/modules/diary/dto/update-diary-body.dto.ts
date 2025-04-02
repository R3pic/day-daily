import { OmitType } from '@nestjs/swagger';
import { CreateDiaryDto } from '@diary/dto/create-diary.dto';

export class UpdateDiaryBody extends OmitType(CreateDiaryDto, ['use_theme']) {}