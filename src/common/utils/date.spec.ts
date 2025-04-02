import dayjs from 'dayjs';

import { DateUtil } from '@common/utils/date';

describe('DateUtil', () => {
  describe('hasExpired', () => {
    it('현재 시간이 기준 시간 이전이면 false를 반환한다', () => {
      const target = new Date('2025-01-01T14:00:00+09:00');
      const now = dayjs('2025-01-02T03:59:00+09:00');

      const result = DateUtil.hasExpired(target, now);
      expect(result).toBe(false);
    });

    it('현재 시간이 기준 시간과 완벽히 동일하다면 false 반환한다', () => {
      const target = new Date('2025-01-01T00:00:00+09:00');
      const now = dayjs('2025-01-02T04:00:00+09:00');

      const result = DateUtil.hasExpired(target, now);
      expect(result).toBe(false);
    });

    it('현재 시간이 기준 시간 이후이면 true를 반환한다', () => {
      const target = new Date('2025-01-01T14:00:00+09:00');
      const now = dayjs('2025-01-02T05:00:00+09:00');

      const result = DateUtil.hasExpired(target, now);
      expect(result).toBe(true);
    });
  });
});
