import { priceListStorage } from './storage.js';
import { createPriceList } from '../models/price_list.js';
import { createPriceItem, isAllowedCategory } from '../models/price_item.js';
import { pricingPolicyService as defaultPricingPolicyService } from './pricing_policy_service.js';
import { priceListLogService as defaultPriceListLogService } from './price_list_log_service.js';

const PRICE_LIST_KEY = 'cms.price_lists';

function loadPriceLists() {
  return priceListStorage.read(PRICE_LIST_KEY, []);
}

function persistPriceLists(priceLists) {
  priceListStorage.write(PRICE_LIST_KEY, priceLists);
}

function formatUsd(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function mapItem({ item, policy, priceListId, logService }) {
  const normalized = createPriceItem({
    id: item && item.id ? item.id : null,
    priceListId,
    category: item && item.category ? item.category : null,
    label: item && item.label ? item.label : '',
    rateType: item && item.rateType ? item.rateType : null,
    amount: item && Number.isFinite(item.amount) ? item.amount : null,
    status: item && item.status ? item.status : 'valid',
  });

  const isCategoryValid = Boolean(normalized.category) && isAllowedCategory(normalized.category);
  const amountValid = Number.isFinite(normalized.amount);
  const statusValid = normalized.status === 'valid' && isCategoryValid && amountValid;

  if (!statusValid) {
    logService.logDataQuality({
      priceListId,
      message: !isCategoryValid ? 'invalid_category' : 'missing_or_invalid_amount',
    });
  }

  if (!statusValid && policy.missingItemDisplay === 'omit') {
    return null;
  }

  const displayAmount = statusValid ? formatUsd(normalized.amount) : 'TBD';
  const displayStatus = statusValid ? 'valid' : 'tbd';

  return {
    id: normalized.id,
    category: normalized.category || (item && item.category ? item.category : 'unknown'),
    label: normalized.label,
    rateType: normalized.rateType,
    amount: normalized.amount,
    displayAmount,
    status: displayStatus,
  };
}

export const priceListService = {
  reset() {
    priceListStorage.remove(PRICE_LIST_KEY);
  },
  savePriceList(priceList) {
    const lists = loadPriceLists().slice();
    const index = lists.findIndex((entry) => entry && entry.conferenceId === priceList.conferenceId);
    const next = createPriceList(priceList);
    if (index === -1) {
      lists.push(next);
    } else {
      lists[index] = next;
    }
    persistPriceLists(lists);
    return next;
  },
  getPriceList(conferenceId) {
    return loadPriceLists().find((entry) => entry && entry.conferenceId === conferenceId) || null;
  },
  getPublishedPriceList({
    conferenceId,
    pricingPolicyService = defaultPricingPolicyService,
    priceListLogService = defaultPriceListLogService,
  } = {}) {
    const policy = pricingPolicyService.getPolicy();
    const list = priceListService.getPriceList(conferenceId);
    if (!list || list.status !== 'published') {
      return { ok: false, reason: 'not_available' };
    }
    const items = Array.isArray(list.items) ? list.items : [];
    const mappedItems = items
      .map((item) => mapItem({ item, policy, priceListId: list.id, logService: priceListLogService }))
      .filter(Boolean);

    return {
      ok: true,
      priceList: createPriceList(list),
      items: mappedItems,
      accessLevel: policy.accessLevel,
      currency: 'USD',
      locale: 'en-US',
      lastUpdatedAt: list.lastUpdatedAt || null,
    };
  },
  formatUsd,
};
