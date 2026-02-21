function generatePriceListId() {
  return `plist_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createPriceList({
  id = null,
  conferenceId = null,
  status = 'unpublished',
  items = [],
  lastUpdatedAt = null,
} = {}) {
  return {
    id: id || generatePriceListId(),
    conferenceId,
    status,
    items: Array.isArray(items) ? items.slice() : [],
    lastUpdatedAt,
  };
}
