import { sessionState } from '../../src/models/session-state.js';
import { pricingPolicyService } from '../../src/services/pricing_policy_service.js';
import { priceListService } from '../../src/services/price_list_service.js';
import { createPriceListView } from '../../src/views/price_list_view.js';
import { createPriceListController } from '../../src/controllers/price_list_controller.js';

beforeEach(() => {
  sessionState.clear();
  pricingPolicyService.reset();
  priceListService.reset();
  document.body.innerHTML = '';
});

test('enforces registered-only pricing policy', () => {
  pricingPolicyService.setAccessLevel('registered');
  priceListService.savePriceList({
    conferenceId: 'conf_policy',
    status: 'published',
    items: [
      { category: 'student', label: 'Standard', amount: 90, status: 'valid' },
    ],
  });

  const guestView = createPriceListView();
  const guestController = createPriceListController({ view: guestView, sessionState });
  guestController.show('conf_policy');
  document.body.appendChild(guestController.view.element);
  expect(document.body.textContent).toContain('Please log in');

  document.body.innerHTML = '';
  sessionState.authenticate({ id: 'acct_user', email: 'user@example.com' });
  const userView = createPriceListView();
  const userController = createPriceListController({ view: userView, sessionState });
  userController.show('conf_policy');
  document.body.appendChild(userController.view.element);
  expect(document.body.textContent).toContain('$90.00');
});
