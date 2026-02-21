import { priceListService } from '../../src/services/price_list_service.js';
import { createPriceListView } from '../../src/views/price_list_view.js';
import { createPriceListController } from '../../src/controllers/price_list_controller.js';

beforeEach(() => {
  priceListService.reset();
  document.body.innerHTML = '';
});

test('labels missing price list items as TBD', () => {
  priceListService.savePriceList({
    conferenceId: 'conf_tbd',
    status: 'published',
    items: [
      { category: 'student', label: 'Standard', amount: null, status: 'valid' },
    ],
  });

  const view = createPriceListView();
  const controller = createPriceListController({ view });
  controller.show('conf_tbd');
  document.body.appendChild(controller.view.element);

  expect(document.body.textContent).toContain('TBD');
});
