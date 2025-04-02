import dayjs from 'dayjs';
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
    month: number = 0,
    day: number = 1,
    hour: number = 0,
    minute: number = 0,
    second: number = 0
  ): Date {
    if (!year)
      return this.now();
    return dayjs(new Date(year, month, day, hour, minute, second)).toDate();
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