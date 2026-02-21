import { priceListService } from '../../src/services/price_list_service.js';
import { pricingPolicyService } from '../../src/services/pricing_policy_service.js';
import { priceListLogService } from '../../src/services/price_list_log_service.js';
import { priceListStorage } from '../../src/services/storage.js';

beforeEach(() => {
  priceListService.reset();
  pricingPolicyService.reset();
  priceListLogService.reset();
});

test('formats USD amounts with en-US locale', () => {
  expect(priceListService.formatUsd(1234)).toBe('$1,234.00');
});

test('maps published price list and labels missing amounts as TBD', () => {
  priceListService.savePriceList({
    conferenceId: 'conf_1',
    status: 'published',
    items: [
      { category: 'student', label: 'Standard', amount: 100, status: 'valid' },
      { category: 'professional', label: 'Standard', amount: null, status: 'valid' },
    ],
  });

  const result = priceListService.getPublishedPriceList({ conferenceId: 'conf_1' });
  expect(result.ok).toBe(true);
  expect(result.items).toHaveLength(2);
  expect(result.items[0].displayAmount).toBe('$100.00');
  expect(result.items[1].displayAmount).toBe('TBD');
  expect(result.items[1].status).toBe('tbd');
});

test('omits missing items when policy is set to omit', () => {
  pricingPolicyService.setMissingItemDisplay('omit');
  priceListService.savePriceList({
    conferenceId: 'conf_2',
    status: 'published',
    items: [
      { category: 'student', label: 'Standard', amount: 100, status: 'valid' },
      { category: 'professional', label: 'Standard', amount: null, status: 'valid' },
    ],
  });

  const result = priceListService.getPublishedPriceList({ conferenceId: 'conf_2' });
  expect(result.ok).toBe(true);
  expect(result.items).toHaveLength(1);
  expect(result.items[0].category).toBe('student');
});

test('logs data-quality issues for invalid categories', () => {
  priceListService.savePriceList({
    conferenceId: 'conf_3',
    status: 'published',
    items: [
      { category: 'vip', label: 'VIP', amount: 250, status: 'valid' },
    ],
  });

  const result = priceListService.getPublishedPriceList({ conferenceId: 'conf_3' });
  expect(result.ok).toBe(true);
  const logs = priceListLogService.getLogs();
  expect(logs).toHaveLength(1);
  expect(logs[0].event).toBe('data_quality_issue');
});

test('updates existing price list entries', () => {
  priceListService.savePriceList({
    conferenceId: 'conf_update',
    status: 'published',
    items: [{ category: 'student', label: 'Standard', amount: 100 }],
  });
  priceListService.savePriceList({
    conferenceId: 'conf_update',
    status: 'published',
    items: [{ category: 'professional', label: 'Standard', amount: 200 }],
  });

  const result = priceListService.getPublishedPriceList({ conferenceId: 'conf_update' });
  expect(result.items).toHaveLength(1);
  expect(result.items[0].category).toBe('professional');
});

test('returns not available when price list missing', () => {
  const result = priceListService.getPublishedPriceList({ conferenceId: 'missing' });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('not_available');
});

test('returns not available when price list is unpublished', () => {
  priceListService.savePriceList({
    conferenceId: 'conf_unpub',
    status: 'unpublished',
    items: [{ category: 'student', label: 'Standard', amount: 100 }],
  });
  const result = priceListService.getPublishedPriceList({ conferenceId: 'conf_unpub' });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('not_available');
});

test('maps items with identifiers and rate types', () => {
  priceListService.savePriceList({
    conferenceId: 'conf_rate',
    status: 'published',
    items: [
      {
        id: 'item_1',
        category: 'student',
        label: 'Early',
        rateType: 'Early bird',
        amount: 75,
        status: 'valid',
      },
    ],
  });
  const result = priceListService.getPublishedPriceList({ conferenceId: 'conf_rate' });
  expect(result.items[0].id).toBe('item_1');
  expect(result.items[0].rateType).toBe('Early bird');
});

test('handles non-array items payloads', () => {
  priceListService.savePriceList({
    conferenceId: 'conf_bad_items',
    status: 'published',
    items: null,
  });
  const result = priceListService.getPublishedPriceList({ conferenceId: 'conf_bad_items' });
  expect(result.items).toHaveLength(0);
});

test('supports default arguments for published list retrieval', () => {
  const result = priceListService.getPublishedPriceList();
  expect(result.ok).toBe(false);
});

test('labels missing category as unknown and keeps empty label', () => {
  priceListService.savePriceList({
    conferenceId: 'conf_unknown',
    status: 'published',
    items: [
      { category: '', label: '', rateType: '', amount: 120, status: 'valid' },
    ],
  });

  const result = priceListService.getPublishedPriceList({ conferenceId: 'conf_unknown' });
  expect(result.ok).toBe(true);
  expect(result.items).toHaveLength(1);
  expect(result.items[0].category).toBe('unknown');
  expect(result.items[0].label).toBe('');
  expect(result.items[0].rateType).toBe(null);
});

test('treats non-array item collections as empty', () => {
  priceListStorage.write('cms.price_lists', [
    {
      id: 'plist_bad_items',
      conferenceId: 'conf_obj_items',
      status: 'published',
      items: { category: 'student', label: 'Standard', amount: 100 },
    },
  ]);
  const result = priceListService.getPublishedPriceList({ conferenceId: 'conf_obj_items' });
  expect(result.items).toHaveLength(0);
});
