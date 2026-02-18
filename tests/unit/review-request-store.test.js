import { reviewRequestStore } from '../../src/services/review-request-store.js';
import { createReviewRequest } from '../../src/models/review_request.js';

beforeEach(() => {
  reviewRequestStore.reset();
});

test('stores and retrieves pending requests', () => {
  const request = createReviewRequest({ assignmentId: 'asg_1', paperId: 'paper_1', reviewerEmail: 'a@example.com' });
  reviewRequestStore.addRequest(request);
  const pending = reviewRequestStore.getPendingRequest('paper_1', 'a@example.com');
  expect(pending).not.toBeNull();
  expect(reviewRequestStore.getRequests()).toHaveLength(1);
});

test('getPendingRequest ignores resolved requests', () => {
  const request = createReviewRequest({
    assignmentId: 'asg_1b',
    paperId: 'paper_1b',
    reviewerEmail: 'resolved@example.com',
    decision: 'accept',
  });
  reviewRequestStore.addRequest(request);
  const pending = reviewRequestStore.getPendingRequest('paper_1b', 'resolved@example.com');
  expect(pending).toBeNull();
});

test('prevents duplicate assignment requests', () => {
  const request = createReviewRequest({ assignmentId: 'asg_2', paperId: 'paper_1', reviewerEmail: 'b@example.com' });
  reviewRequestStore.addRequest(request);
  expect(() => reviewRequestStore.addRequest(request)).toThrow('duplicate_request');
});

test('prevents duplicate pending requests by email', () => {
  const request = createReviewRequest({ assignmentId: 'asg_3', paperId: 'paper_2', reviewerEmail: 'c@example.com' });
  reviewRequestStore.addRequest(request);
  const duplicate = createReviewRequest({ assignmentId: 'asg_4', paperId: 'paper_2', reviewerEmail: 'c@example.com' });
  expect(() => reviewRequestStore.addRequest(duplicate)).toThrow('duplicate_request');
});

test('updateRequest throws for missing request', () => {
  const request = createReviewRequest({ assignmentId: 'asg_5', paperId: 'paper_3', reviewerEmail: 'd@example.com' });
  expect(() => reviewRequestStore.updateRequest(request)).toThrow('request_not_found');
});

test('throws on lookup failure mode', () => {
  reviewRequestStore.setLookupFailureMode(true);
  expect(() => reviewRequestStore.getRequests()).toThrow('lookup_failure');
  reviewRequestStore.setLookupFailureMode(false);
});

test('throws on save failure mode', () => {
  reviewRequestStore.setSaveFailureMode(true);
  const request = createReviewRequest({ assignmentId: 'asg_6', paperId: 'paper_4', reviewerEmail: 'e@example.com' });
  expect(() => reviewRequestStore.addRequest(request)).toThrow('save_failure');
  reviewRequestStore.setSaveFailureMode(false);
});

test('loads requests from localStorage', () => {
  const stored = [
    createReviewRequest({ assignmentId: 'asg_local', paperId: 'paper_local', reviewerEmail: 'local@example.com' }),
  ];
  localStorage.setItem('cms.review_requests', JSON.stringify(stored));
  const requests = reviewRequestStore.getRequests();
  expect(requests).toHaveLength(1);
  const pending = reviewRequestStore.getPendingRequest('paper_local', 'local@example.com');
  expect(pending).not.toBeNull();
});
