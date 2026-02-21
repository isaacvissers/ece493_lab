import { priceListService } from '../../src/services/price_list_service.js';
import { priceListLogService } from '../../src/services/price_list_log_service.js';

beforeEach(() => {
  priceListService.reset();
  priceListLogService.reset();
});

test('logs data-quality issues for missing or invalid entries', () => {
  priceListService.savePriceList({
    conferenceId: 'conf_quality',
    status: 'published',
    items: [
      { category: 'vip', label: 'VIP', amount: 250, status: 'valid' },
      { category: 'student', label: 'Standard', amount: null, status: 'valid' },
    ],
  });

  const result = priceListService.getPublishedPriceList({ conferenceId: 'conf_quality' });
  expect(result.ok).toBe(true);
  const logs = priceListLogService.getLogs();
  expect(logs).toHaveLength(2);
  expect(logs[0].event).toBe('data_quality_issue');
});
