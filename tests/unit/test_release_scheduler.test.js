import { releaseScheduler } from '../../src/services/release_scheduler.js';

test('release scheduler handles invalid date', () => {
  expect(releaseScheduler.getDelayMs('invalid', Date.now())).toBe(0);
  expect(releaseScheduler.isReleased('invalid', Date.now())).toBe(true);
});

test('release scheduler reports future release', () => {
  const future = new Date(Date.now() + 1000).toISOString();
  expect(releaseScheduler.isReleased(future, Date.now())).toBe(false);
});

test('release scheduler fires immediately when release is now', () => {
  let fired = false;
  releaseScheduler.schedule({ releaseAt: null, onRelease: () => { fired = true; } });
  expect(fired).toBe(true);
});
