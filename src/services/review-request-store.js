import { normalizeReviewerEmail } from '../models/reviewer.js';

const REQUESTS_KEY = 'cms.review_requests';

let cachedRequests = null;
let lookupFailure = false;
let saveFailure = false;

function loadRequests() {
  if (lookupFailure) {
    throw new Error('lookup_failure');
  }
  if (cachedRequests) {
    return cachedRequests;
  }
  const raw = localStorage.getItem(REQUESTS_KEY);
  cachedRequests = raw ? JSON.parse(raw) : [];
  return cachedRequests;
}

function persistRequests(requests) {
  if (saveFailure) {
    throw new Error('save_failure');
  }
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
  cachedRequests = requests;
}

function normalizeEmail(email) {
  return normalizeReviewerEmail(email);
}

export const reviewRequestStore = {
  setLookupFailureMode(enabled) {
    lookupFailure = Boolean(enabled);
  },
  setSaveFailureMode(enabled) {
    saveFailure = Boolean(enabled);
  },
  reset() {
    lookupFailure = false;
    saveFailure = false;
    cachedRequests = null;
    localStorage.removeItem(REQUESTS_KEY);
  },
  getRequests() {
    return loadRequests().slice();
  },
  getRequest(requestId) {
    return loadRequests().find((request) => request.requestId === requestId) || null;
  },
  getPendingRequest(paperId, reviewerEmail) {
    const normalized = normalizeEmail(reviewerEmail);
    return loadRequests().find((request) => (
      request.paperId === paperId
      && request.reviewerEmail === normalized
      && !request.decision
    )) || null;
  },
  addRequest(request) {
    const normalized = normalizeEmail(request.reviewerEmail);
    const requests = loadRequests().slice();
    if (requests.some((entry) => entry.assignmentId === request.assignmentId)) {
      throw new Error('duplicate_request');
    }
    if (requests.some((entry) => (
      entry.paperId === request.paperId
      && entry.reviewerEmail === normalized
      && !entry.decision
    ))) {
      throw new Error('duplicate_request');
    }
    const nextRequest = { ...request, reviewerEmail: normalized };
    requests.push(nextRequest);
    persistRequests(requests);
    return nextRequest;
  },
  updateRequest(updated) {
    const requests = loadRequests().slice();
    const index = requests.findIndex((entry) => entry.requestId === updated.requestId);
    if (index === -1) {
      throw new Error('request_not_found');
    }
    requests[index] = { ...updated };
    persistRequests(requests);
    return requests[index];
  },
};
