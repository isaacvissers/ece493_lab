function generatePriceListLogId() {
  return `plog_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createPriceListLog({
  id = null,
  priceListId = null,
  event = 'data_quality_issue',
  timestamp = null,
  message = null,
} = {}) {
  return {
    id: id || generatePriceListLogId(),
    priceListId,
    event,
    timestamp: timestamp || new Date().toISOString(),
    message,
  };
}
