import { createPricingPolicy } from '../models/pricing_policy.js';

const ACCESS_KEY = 'pricingPolicy';
const MISSING_ITEM_KEY = 'pricingMissingItemDisplay';

function readAccessSetting() {
  const raw = localStorage.getItem(ACCESS_KEY);
  const normalized = raw ? raw.toString().trim().toLowerCase() : '';
  if (normalized === 'registered') {
    return 'registered_only';
  }
  if (normalized === 'registered_only') {
    return 'registered_only';
  }
  return 'public';
}

function readMissingItemSetting() {
  const raw = localStorage.getItem(MISSING_ITEM_KEY);
  const normalized = raw ? raw.toString().trim().toLowerCase() : '';
  return normalized === 'omit' ? 'omit' : 'tbd';
}

export const pricingPolicyService = {
  getPolicy() {
    return createPricingPolicy({
      accessLevel: readAccessSetting(),
      missingItemDisplay: readMissingItemSetting(),
    });
  },
  setAccessLevel(value) {
    localStorage.setItem(ACCESS_KEY, value);
  },
  setMissingItemDisplay(value) {
    localStorage.setItem(MISSING_ITEM_KEY, value);
  },
  reset() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(MISSING_ITEM_KEY);
  },
};
