import { createReviewRequest, isResolvedRequest } from '../../src/models/review_request.js';

test('creates review request with generated id', () => {
  const request = createReviewRequest({ assignmentId: 'asg_1', paperId: 'paper_1', reviewerEmail: 'a@example.com' });
  expect(request.requestId).toMatch(/^req_/);
  expect(request.sentAt).toBeTruthy();
});

test('uses provided sentAt timestamp', () => {
  const request = createReviewRequest({
    assignmentId: 'asg_2',
    paperId: 'paper_2',
    reviewerEmail: 'b@example.com',
    sentAt: '2026-02-01T10:00:00.000Z',
  });
  expect(request.sentAt).toBe('2026-02-01T10:00:00.000Z');
});

test('handles defaults when called without args', () => {
  const request = createReviewRequest();
  expect(request.requestId).toMatch(/^req_/);
  expect(request.status).toBe('sent');
});

test('detects resolved requests', () => {
  expect(isResolvedRequest({ decision: 'accept' })).toBe(true);
  expect(isResolvedRequest({ decision: null })).toBe(false);
  expect(isResolvedRequest(null)).toBe(false);
});
