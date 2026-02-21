import { priceListService } from '../../src/services/price_list_service.js';
import { priceListLogService } from '../../src/services/price_list_log_service.js';
import { createPriceListView } from '../../src/views/price_list_view.js';
import { createPriceListErrorView } from '../../src/views/price_list_error_view.js';
import { createPriceListController } from '../../src/controllers/price_list_controller.js';

beforeEach(() => {
  priceListService.reset();
  priceListLogService.reset();
  document.body.innerHTML = '';
});

test('render failures show friendly error message with retry cue', () => {
  priceListService.savePriceList({
    conferenceId: 'conf_fail',
    status: 'published',
    items: [
      { category: 'student', label: 'Standard', amount: 100, status: 'valid' },
    ],
  });

  const view = createPriceListView();
  view.renderPriceList = () => {
    throw new Error('render_failed');
  };
  const errorView = createPriceListErrorView();
  const controller = createPriceListController({ view, errorView });
  controller.show('conf_fail');
  document.body.appendChild(controller.view.element);

  expect(document.body.textContent).toContain('Pricing cannot be displayed right now');
  expect(priceListLogService.getLogs()[0].event).toBe('render_failure');
});
