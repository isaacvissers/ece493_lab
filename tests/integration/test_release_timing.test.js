import { jest } from '@jest/globals';
import { releaseScheduler } from '../../src/services/release_scheduler.js';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

test('release scheduler fires at release time', () => {
  const releaseAt = new Date(Date.now() + 5000).toISOString();
  let released = false;
  const schedule = releaseScheduler.schedule({
    releaseAt,
    now: Date.now(),
    onRelease: () => {
      released = true;
    },
  });

  jest.advanceTimersByTime(5000);
  expect(released).toBe(true);
  schedule.cancel();
});
