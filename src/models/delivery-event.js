import { DELIVERY_STATUS } from './delivery-constants.js';

function generateDeliveryId() {
  return `del_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createDeliveryEvent({
  deliveryId = null,
  reviewId,
  editorId,
  status = DELIVERY_STATUS.delivered,
  reason = null,
  deliveredAt = null,
} = {}) {
  return {
    deliveryId: deliveryId || generateDeliveryId(),
    reviewId,
    editorId,
    status,
    reason,
    deliveredAt: deliveredAt || new Date().toISOString(),
  };
}
