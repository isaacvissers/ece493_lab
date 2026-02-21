import { sessionState } from '../../src/models/session-state.js';
import { priceListService } from '../../src/services/price_list_service.js';
import { pricingPolicyService } from '../../src/services/pricing_policy_service.js';
import { createPriceListView } from '../../src/views/price_list_view.js';
import { createPriceListController } from '../../src/controllers/price_list_controller.js';

beforeEach(() => {
  sessionState.clear();
  priceListService.reset();
  pricingPolicyService.reset();
  document.body.innerHTML = '';
});

test('registered user can view published price list', () => {
  sessionState.authenticate({ id: 'acct_user', email: 'user@example.com' });
  priceListService.savePriceList({
    conferenceId: 'conf_public',
    status: 'published',
    items: [
      { category: 'professional', label: 'Standard', amount: 250, status: 'valid' },
    ],
  });

  const view = createPriceListView();
  const controller = createPriceListController({ view, sessionState });
  controller.show('conf_public');
  document.body.appendChild(controller.view.element);

  expect(document.body.textContent).toContain('$250.00');
});
