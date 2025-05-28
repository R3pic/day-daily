import dayjs, { Dayjs } from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Seoul');

export class DateUtil {
  static now() {
    return dayjs().toDate();
  }

  static date(
    year?: number,
    month: number = 1,
    day: number = 1,
    hour: number = 0,
    minute: number = 0,
    second: number = 0
  ): Date {
    if (!year)
      return this.now();
    return dayjs(new Date(year, month - 1, day, hour, minute, second)).toDate();
  }

  static dayjs(
    year?: number,
    month: number = 1,
    day: number = 1,
    hour: number = 0,
    minute: number = 0,
    second: number = 0
  ): Dayjs {
    if (!year)
      return dayjs();
    return dayjs()
      .set('year', year)
      .set('month', month - 1)
      .set('d', day)
      .set('h', hour)
      .set('minute', minute)
      .set('second', second);
  }

  static fromString(str: string): Dayjs {
    return dayjs(str);
  }

  static hasExpired(target: Date, now: dayjs.Dayjs = dayjs()) {
    const expireDate = dayjs(target)
      .add(1, 'day')
      .set('hour', 4)
      .set('minute', 0)
      .set('second', 0)
      .set('millisecond', 0);

    return now.isAfter(expireDate);
  }
}