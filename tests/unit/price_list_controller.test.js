import { jest } from '@jest/globals';
import { createPriceListController } from '../../src/controllers/price_list_controller.js';
import { createPriceListView } from '../../src/views/price_list_view.js';
import { pricingPolicyService } from '../../src/services/pricing_policy_service.js';
import { priceListService } from '../../src/services/price_list_service.js';
import { priceListLogService } from '../../src/services/price_list_log_service.js';
import { sessionState } from '../../src/models/session-state.js';

beforeEach(() => {
  document.body.innerHTML = '';
  pricingPolicyService.reset();
  priceListService.reset();
  priceListLogService.reset();
  sessionState.clear();
});

test('controller supports default arguments', () => {
  const controller = createPriceListController();
  expect(typeof controller.show).toBe('function');
});

test('calls onAuthRequired when access is restricted', () => {
  pricingPolicyService.setAccessLevel('registered');
  const view = createPriceListView();
  const onAuthRequired = jest.fn();
  const controller = createPriceListController({ view, onAuthRequired, sessionState });
  controller.show('conf_auth');
  expect(onAuthRequired).toHaveBeenCalled();
});

test('falls back to status message when error view is missing', () => {
  priceListService.savePriceList({
    conferenceId: 'conf_fail',
    status: 'published',
    items: [{ category: 'student', label: 'Standard', amount: 100 }],
  });
  const view = createPriceListView();
  view.renderPriceList = () => {
    throw new Error('render_failed');
  };
  const controller = createPriceListController({ view });
  controller.show('conf_fail');
  expect(view.element.querySelector('#price-list-status').textContent)
    .toContain('Pricing cannot be displayed');
});

test('logs render failures without error message', () => {
  priceListService.savePriceList({
    conferenceId: 'conf_no_msg',
    status: 'published',
    items: [{ category: 'student', label: 'Standard', amount: 100 }],
  });
  const view = createPriceListView();
  view.renderPriceList = () => {
    throw {};
  };
  const controller = createPriceListController({ view });
  controller.show('conf_no_msg');
  expect(priceListLogService.getLogs()[0].message).toBe('render_failed');
});

test('renders price list when available without timeout', () => {
  priceListService.savePriceList({
    conferenceId: 'conf_ok',
    status: 'published',
    items: [{ category: 'student', label: 'Standard', amount: 100 }],
  });
  const view = createPriceListView();
  const performanceService = {
    now: (() => {
      const values = [0, 10];
      return () => values.shift();
    })(),
  };
  const controller = createPriceListController({ view, performanceService, timeoutMs: 2000 });
  controller.show('conf_ok');
  expect(view.element.textContent).toContain('$100.00');
});
