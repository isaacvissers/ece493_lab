const ALLOWED_CATEGORIES = ['student', 'professional', 'early-bird', 'workshop'];

function generatePriceItemId() {
  return `pitem_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function isAllowedCategory(category) {
  return ALLOWED_CATEGORIES.includes(category);
}

export function createPriceItem({
  id = null,
  priceListId = null,
  category = null,
  label = '',
  rateType = null,
  amount = null,
  status = 'valid',
} = {}) {
  const normalizedCategory = category ? category.toString().trim().toLowerCase() : null;
  const allowed = normalizedCategory && isAllowedCategory(normalizedCategory);
  return {
    id: id || generatePriceItemId(),
    priceListId,
    category: allowed ? normalizedCategory : null,
    label,
    rateType,
    amount: Number.isFinite(amount) ? amount : amount === null ? null : null,
    status: allowed ? status : 'invalid',
  };
}

export const PRICE_ITEM_CATEGORIES = ALLOWED_CATEGORIES.slice();
