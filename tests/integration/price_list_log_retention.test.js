import { priceListLogService } from '../../src/services/price_list_log_service.js';

beforeEach(() => {
  priceListLogService.reset();
});

test('prunes price list logs older than 90 days', () => {
  const now = Date.now();
  const oldDate = new Date(now - 120 * 24 * 60 * 60 * 1000).toISOString();
  const recentDate = new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString();
  priceListLogService.log({ priceListId: 'plist_old', event: 'timeout', createdAt: oldDate });
  priceListLogService.log({ priceListId: 'plist_new', event: 'render_failure', createdAt: recentDate });
  const remaining = priceListLogService.pruneOlderThan(90, now);
  expect(remaining).toHaveLength(1);
  expect(remaining[0].priceListId).toBe('plist_new');
});
