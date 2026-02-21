import { createPriceListView } from '../../src/views/price_list_view.js';
import { createPriceListController } from '../../src/controllers/price_list_controller.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('price list view responds within 200 ms for typical data', () => {
  const items = [];
  for (let i = 0; i < 30; i += 1) {
    items.push({
      category: 'student',
      label: `Tier ${i}`,
      rateType: 'Standard',
      displayAmount: '$100.00',
    });
  }
  const priceListService = {
    getPublishedPriceList: () => ({
      ok: true,
      priceList: { id: 'plist_perf' },
      items,
      lastUpdatedAt: '2026-03-01T00:00:00.000Z',
    }),
  };

  const view = createPriceListView();
  document.body.appendChild(view.element);
  const controller = createPriceListController({ view, priceListService, timeoutMs: 2000 });
  const start = Date.now();
  controller.show('conf_perf');
  const elapsed = Date.now() - start;
  expect(elapsed).toBeLessThan(200);
});
