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

test('access restriction blocks guests but allows registered users', () => {
  pricingPolicyService.setAccessLevel('registered');
  priceListService.savePriceList({
    conferenceId: 'conf_restricted',
    status: 'published',
    items: [
      { category: 'student', label: 'Standard', amount: 100, status: 'valid' },
    ],
  });

  const guestView = createPriceListView();
  const guestController = createPriceListController({ view: guestView, sessionState });
  guestController.show('conf_restricted');
  document.body.appendChild(guestController.view.element);
  expect(document.body.textContent).toContain('Please log in to view pricing.');

  document.body.innerHTML = '';
  sessionState.authenticate({ id: 'acct_user', email: 'user@example.com' });
  const userView = createPriceListView();
  const userController = createPriceListController({ view: userView, sessionState });
  userController.show('conf_restricted');
  document.body.appendChild(userController.view.element);
  expect(document.body.textContent).toContain('$100.00');
});
