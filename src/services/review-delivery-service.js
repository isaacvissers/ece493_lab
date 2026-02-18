import { createDeliveryEvent } from '../models/delivery-event.js';
import { DELIVERY_STATUS } from '../models/delivery-constants.js';

const DELIVERY_KEY = 'cms.review_delivery_events';
const EDITOR_LIST_KEY = 'cms.editor_review_list';

let cachedDeliveries = null;
let cachedEditorList = null;

function loadList(key, fallback) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
}

function persistList(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadDeliveries() {
  if (cachedDeliveries) {
    return cachedDeliveries;
  }
  cachedDeliveries = loadList(DELIVERY_KEY, []);
  return cachedDeliveries;
}

function loadEditorList() {
  if (cachedEditorList) {
    return cachedEditorList;
  }
  cachedEditorList = loadList(EDITOR_LIST_KEY, {});
  return cachedEditorList;
}

export const reviewDeliveryService = {
  reset() {
    cachedDeliveries = null;
    cachedEditorList = null;
    localStorage.removeItem(DELIVERY_KEY);
    localStorage.removeItem(EDITOR_LIST_KEY);
  },
  hasDelivered(reviewId) {
    return loadDeliveries().some((event) => event.reviewId === reviewId && event.status === DELIVERY_STATUS.delivered);
  },
  deliverReview({ reviewId, editorId } = {}) {
    if (!reviewId || !editorId) {
      return { ok: false, reason: 'missing_target' };
    }
    if (this.hasDelivered(reviewId)) {
      return { ok: true, status: 'already_delivered' };
    }
    const deliveries = loadDeliveries().slice();
    deliveries.push(createDeliveryEvent({ reviewId, editorId, status: DELIVERY_STATUS.delivered }));
    cachedDeliveries = deliveries;
    persistList(DELIVERY_KEY, deliveries);

    const editorList = { ...loadEditorList() };
    const current = Array.isArray(editorList[editorId]) ? editorList[editorId].slice() : [];
    current.push({ reviewId, deliveredAt: new Date().toISOString() });
    editorList[editorId] = current;
    cachedEditorList = editorList;
    persistList(EDITOR_LIST_KEY, editorList);
    return { ok: true, status: 'delivered' };
  },
  getEditorReviews(editorId) {
    const list = loadEditorList();
    return Array.isArray(list[editorId]) ? list[editorId].slice() : [];
  },
};
