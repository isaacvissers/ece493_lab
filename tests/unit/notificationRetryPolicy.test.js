import { notificationService } from '../../src/services/notification-service.js';

beforeEach(() => {
  notificationService.clear();
});

test('provides retry delay schedule', () => {
  const delays = notificationService.getRetryDelays();
  expect(delays).toEqual([60 * 1000, 5 * 60 * 1000, 15 * 60 * 1000]);
});
