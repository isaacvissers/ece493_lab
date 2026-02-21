import { sessionState } from '../../src/models/session-state.js';
import { priceListService } from '../../src/services/price_list_service.js';
import { pricingPolicyService } from '../../src/services/pricing_policy_service.js';
import { priceListLogService } from '../../src/services/price_list_log_service.js';
import { createPriceListView } from '../../src/views/price_list_view.js';
import { createPriceListErrorView } from '../../src/views/price_list_error_view.js';
import { createPriceListController } from '../../src/controllers/price_list_controller.js';

beforeEach(() => {
  sessionState.clear();
  priceListService.reset();
  pricingPolicyService.reset();
  priceListLogService.reset();
  document.body.innerHTML = '';
});

test('guest can view published price list', () => {
  priceListService.savePriceList({
    conferenceId: 'conf_public',
    status: 'published',
    items: [
      { category: 'student', label: 'Standard', amount: 100, status: 'valid' },
    ],
  });

  const view = createPriceListView();
  const errorView = createPriceListErrorView();
  const controller = createPriceListController({ view, errorView });
  controller.show('conf_public');
  document.body.appendChild(controller.view.element);

  expect(document.body.textContent).toContain('Price list');
  expect(document.body.textContent).toContain('$100.00');
});
