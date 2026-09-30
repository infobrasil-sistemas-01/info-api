import { Reflector } from '@nestjs/core';
import {
  SKIP_DATE_RANGE_LIMIT_KEY,
  SkipDateRangeLimit,
} from './skip-date-range-limit.decorator';

describe('SkipDateRangeLimit Decorator', () => {
  class TestController {
    @SkipDateRangeLimit()
    testMethod() {}
  }

  it('should set skipDateRangeLimit metadata to true on the target method', () => {
    const reflector = new Reflector();
    const metadata = reflector.get<boolean>(
      SKIP_DATE_RANGE_LIMIT_KEY,
      TestController.prototype.testMethod,
    );
    expect(metadata).toBe(true);
  });
});
