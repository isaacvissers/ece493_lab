import { createPriceListView } from '../../src/views/price_list_view.js';
import { createPriceListController } from '../../src/controllers/price_list_controller.js';
import { priceListService } from '../../src/services/price_list_service.js';
import { priceListLogService } from '../../src/services/price_list_log_service.js';

beforeEach(() => {
  document.body.innerHTML = '';
  priceListService.reset();
  priceListLogService.reset();
});

test('shows timeout message and logs when render exceeds threshold', () => {
  priceListService.savePriceList({
    conferenceId: 'conf_time',
    status: 'published',
    items: [{ category: 'student', label: 'Standard', amount: 100 }],
  });

  const view = createPriceListView();
  const performanceService = {
    now: (() => {
      const values = [0, 3000];
      return () => values.shift();
    })(),
  };

  const controller = createPriceListController({
    view,
    performanceService,
    timeoutMs: 2000,
  });
  controller.show('conf_time');

  expect(view.element.querySelector('#price-list-status').textContent)
    .toContain('taking longer');
  expect(priceListLogService.getLogs()[0].event).toBe('timeout');
});
