import { sessionState } from '../../src/models/session-state.js';
import { priceListService } from '../../src/services/price_list_service.js';
import { createPriceListView } from '../../src/views/price_list_view.js';
import { createPriceListController } from '../../src/controllers/price_list_controller.js';

beforeEach(() => {
  sessionState.clear();
  priceListService.reset();
  document.body.innerHTML = '';
});

test('shows not available message when no published price list exists', () => {
  const view = createPriceListView();
  const controller = createPriceListController({ view });
  controller.show('conf_missing');
  document.body.appendChild(controller.view.element);

  expect(document.body.textContent).toContain('Price list not available yet');
});
