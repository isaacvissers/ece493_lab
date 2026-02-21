import { priceListLogService } from '../../src/services/price_list_log_service.js';

beforeEach(() => {
  priceListLogService.reset();
});

test('logs price list issues and prunes old entries', () => {
  priceListLogService.log();
  priceListLogService.logDataQuality();
  priceListLogService.logRenderFailure();
  priceListLogService.logTimeout();
  priceListLogService.logDataQuality({ priceListId: 'plist_quality', message: 'missing_amount' });
  priceListLogService.logRenderFailure({ priceListId: 'plist_1', message: 'render_failed' });
  priceListLogService.logTimeout({ priceListId: 'plist_1', message: 'timeout' });
  const now = Date.now();
  const oldDate = new Date(now - 120 * 24 * 60 * 60 * 1000).toISOString();
  priceListLogService.log({ priceListId: 'plist_invalid', createdAt: 'not-a-date' });
  priceListLogService.log({ priceListId: 'plist_old', createdAt: oldDate });
  const remaining = priceListLogService.pruneOlderThan(90, now);
  expect(remaining.some((log) => log.priceListId === 'plist_old')).toBe(false);
  expect(remaining.some((log) => log.priceListId === 'plist_invalid')).toBe(true);
});

test('prunes logs using default retention window', () => {
  const now = Date.now();
  const oldDate = new Date(now - 120 * 24 * 60 * 60 * 1000).toISOString();
  priceListLogService.log({ priceListId: 'plist_recent', createdAt: new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString() });
  priceListLogService.log({ priceListId: 'plist_old', createdAt: oldDate });
  const remaining = priceListLogService.pruneOlderThan();
  expect(remaining.some((log) => log.priceListId === 'plist_old')).toBe(false);
  expect(remaining.some((log) => log.priceListId === 'plist_recent')).toBe(true);
});
