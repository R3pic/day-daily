import { Injectable, Logger } from '@nestjs/common';
import { DiaryCalendarRepository } from '@diary/diary-calendar.repository';
import { UserService } from '@user/user.service';
import { GetCalendarQuery } from '@diary/dto';
import { DateUtil } from '@common/utils/date';

@Injectable()
export class DiaryCalendarService {
  private readonly logger = new Logger(DiaryCalendarService.name);

  constructor(
    private readonly userService: UserService,
    private readonly repository: DiaryCalendarRepository,
  ) {}

  async findByUserId(id: string, query: GetCalendarQuery): Promise<boolean[]> {
    this.logger.debug(`findByUserId: ${query.year}-${query.month}`);
    await this.userService.existsById(id);

    const days = await this.repository.findWrittenDays(id, query);

    const lastDate = DateUtil.dayjs(query.year, query.month, 0);

    const calendar = Array
      .from({ length: lastDate.daysInMonth() })
      .map((_, i) => days.has(i + 1));

    // calendar.forEach((v, i) => this.logger.debug(`${i + 1}: ${v}`));

    return calendar;
  }
}