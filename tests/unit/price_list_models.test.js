import { jest } from '@jest/globals';
import { createPriceList } from '../../src/models/price_list.js';
import { createPriceListLog } from '../../src/models/price_list_log.js';
import { createPricingPolicy } from '../../src/models/pricing_policy.js';
import { createPriceItem } from '../../src/models/price_item.js';

beforeEach(() => {
  jest.useFakeTimers().setSystemTime(new Date('2026-02-01T00:00:00.000Z'));
});

afterEach(() => {
  jest.useRealTimers();
});

test('price list model defaults values and copies items', () => {
  const list = createPriceList({ conferenceId: 'conf_1', items: [{ id: 'item_1' }] });
  expect(list.conferenceId).toBe('conf_1');
  expect(list.items).toHaveLength(1);
  expect(list.status).toBe('unpublished');

  const emptyList = createPriceList();
  expect(emptyList.items).toHaveLength(0);

  const invalidItems = createPriceList({ items: 'not-array' });
  expect(invalidItems.items).toHaveLength(0);
});

test('price list log model fills defaults', () => {
  const log = createPriceListLog();
  expect(log.event).toBe('data_quality_issue');
  expect(log.timestamp).toBe('2026-02-01T00:00:00.000Z');

  const explicit = createPriceListLog({ event: 'timeout', timestamp: '2026-02-02T00:00:00.000Z' });
  expect(explicit.event).toBe('timeout');
  expect(explicit.timestamp).toBe('2026-02-02T00:00:00.000Z');
});

test('pricing policy normalizes values', () => {
  const policy = createPricingPolicy({ accessLevel: 'registered_only', missingItemDisplay: 'omit' });
  expect(policy.accessLevel).toBe('registered_only');
  expect(policy.missingItemDisplay).toBe('omit');

  const defaultPolicy = createPricingPolicy();
  expect(defaultPolicy.accessLevel).toBe('public');
  expect(defaultPolicy.missingItemDisplay).toBe('tbd');

  const fallbackPolicy = createPricingPolicy({ accessLevel: 'unknown', missingItemDisplay: 'unknown' });
  expect(fallbackPolicy.accessLevel).toBe('public');
  expect(fallbackPolicy.missingItemDisplay).toBe('tbd');
});

test('price item handles finite and non-finite amounts', () => {
  const valid = createPriceItem({ category: 'student', amount: 50, status: 'valid' });
  expect(valid.amount).toBe(50);

  const empty = createPriceItem();
  expect(empty.category).toBeNull();
  expect(empty.amount).toBeNull();

  const missingAmount = createPriceItem({ category: 'student', amount: null, status: 'valid' });
  expect(missingAmount.amount).toBeNull();

  const invalid = createPriceItem({ category: 'student', amount: Number.NaN, status: 'valid' });
  expect(invalid.amount).toBeNull();
});
