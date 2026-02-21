import { priceListService } from '../../src/services/price_list_service.js';
import { createPriceListView } from '../../src/views/price_list_view.js';
import { createPriceListController } from '../../src/controllers/price_list_controller.js';

beforeEach(() => {
  priceListService.reset();
  document.body.innerHTML = '';
});

test('retrieves and renders published price list', () => {
  priceListService.savePriceList({
    conferenceId: 'conf_10',
    status: 'published',
    lastUpdatedAt: '2026-03-01T00:00:00.000Z',
    items: [
      { category: 'student', label: 'Standard', amount: 80, status: 'valid' },
      { category: 'workshop', label: 'Workshop', amount: 40, status: 'valid' },
    ],
  });

  const view = createPriceListView();
  const controller = createPriceListController({ view });
  controller.show('conf_10');
  document.body.appendChild(controller.view.element);

  expect(document.body.textContent).toContain('Student - Standard');
  expect(document.body.textContent).toContain('$80.00');
  expect(document.body.textContent).toContain('Workshop - Workshop');
  expect(document.body.textContent).toContain('$40.00');
});
