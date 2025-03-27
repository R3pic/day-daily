import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Seoul');

export function hasTimePassed(target: Date, unit: dayjs.UnitType, threshold: number): boolean {
  return dayjs().diff(dayjs(target), unit) >= threshold;
}