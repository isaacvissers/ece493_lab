import { priceListService as defaultPriceListService } from '../services/price_list_service.js';
import { pricingPolicyService as defaultPricingPolicyService } from '../services/pricing_policy_service.js';
import { priceListLogService as defaultPriceListLogService } from '../services/price_list_log_service.js';
import { performanceService as defaultPerformanceService } from '../services/performance_service.js';
import { sessionState as defaultSessionState } from '../models/session-state.js';

const ACCESS_MESSAGE = 'Please log in to view pricing.';
const RENDER_ERROR_MESSAGE = 'Pricing cannot be displayed right now. Please try again.';
const TIMEOUT_MESSAGE = 'Pricing is taking longer than expected. Please try again.';

export function createPriceListController({
  view,
  errorView = null,
  priceListService = defaultPriceListService,
  pricingPolicyService = defaultPricingPolicyService,
  priceListLogService = defaultPriceListLogService,
  performanceService = defaultPerformanceService,
  sessionState = defaultSessionState,
  timeoutMs = 2000,
  onAuthRequired = null,
} = {}) {
  let currentView = view;

  function setActiveView(next) {
    currentView = next;
  }

  function show(conferenceId) {
    setActiveView(view);
    view.setStatus('', false);
    view.setLoading(false);

    const policy = pricingPolicyService.getPolicy();
    if (policy.accessLevel === 'registered_only' && !sessionState.isAuthenticated()) {
      view.setAccessRestricted(ACCESS_MESSAGE);
      if (typeof onAuthRequired === 'function') {
        onAuthRequired(ACCESS_MESSAGE);
      }
      return currentView;
    }

    const startTime = performanceService.now();
    const result = priceListService.getPublishedPriceList({ conferenceId });
    if (!result.ok) {
      view.setNotAvailable('Price list not available yet.');
      return currentView;
    }

    view.setLoading(true);
    try {
      view.renderPriceList({
        items: result.items,
        lastUpdatedAt: result.lastUpdatedAt,
      });
    } catch (error) {
      view.setLoading(false);
      if (errorView) {
        errorView.setMessage(RENDER_ERROR_MESSAGE);
        setActiveView(errorView);
      } else {
        view.setStatus(RENDER_ERROR_MESSAGE, true);
      }
      priceListLogService.logRenderFailure({
        priceListId: result.priceList.id,
        message: error && error.message ? error.message : 'render_failed',
      });
      return currentView;
    }

    const duration = performanceService.now() - startTime;
    if (duration > timeoutMs) {
      view.setLoading(false);
      view.setTimeout(TIMEOUT_MESSAGE);
      priceListLogService.logTimeout({
        priceListId: result.priceList.id,
        message: 'render_timeout',
      });
      return currentView;
    }

    view.setLoading(false);
    return currentView;
  }

  return {
    get view() {
      return currentView;
    },
    show,
  };
}
