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