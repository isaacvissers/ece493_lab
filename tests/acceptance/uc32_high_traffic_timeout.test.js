import { priceListService } from '../../src/services/price_list_service.js';
import { priceListLogService } from '../../src/services/price_list_log_service.js';
import { createPriceListView } from '../../src/views/price_list_view.js';
import { createPriceListController } from '../../src/controllers/price_list_controller.js';

beforeEach(() => {
  priceListService.reset();
  priceListLogService.reset();
  document.body.innerHTML = '';
});

test('shows timeout message under slow load', () => {
  priceListService.savePriceList({
    conferenceId: 'conf_slow',
    status: 'published',
    items: [
      { category: 'professional', label: 'Standard', amount: 300, status: 'valid' },
    ],
  });

  const view = createPriceListView();
  const performanceService = {
    now: (() => {
      const values = [0, 2501];
      return () => values.shift();
    })(),
  };

  const controller = createPriceListController({
    view,
    performanceService,
    timeoutMs: 2000,
  });

  controller.show('conf_slow');
  document.body.appendChild(controller.view.element);

  expect(document.body.textContent).toContain('taking longer than expected');
  expect(priceListLogService.getLogs()[0].event).toBe('timeout');
});
