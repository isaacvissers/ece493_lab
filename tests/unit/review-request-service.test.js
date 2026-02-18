import { jest } from '@jest/globals';
import { reviewRequestService } from '../../src/services/review-request-service.js';
import { reviewRequestStore } from '../../src/services/review-request-store.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { assignmentStorage } from '../../src/services/assignment-storage.js';
import { createReviewRequest } from '../../src/models/review_request.js';

beforeEach(() => {
  reviewRequestStore.reset();
  reviewRequestService.setDeliveryFailureMode(false);
  assignmentStore.reset();
  assignmentStorage.reset();
});

test('sendReviewRequests stores sent request', () => {
  const result = reviewRequestService.sendReviewRequests({
    paperId: 'paper_1',
    reviewerEmails: ['a@example.com'],
  });
  expect(result.sent).toHaveLength(1);
  expect(reviewRequestStore.getRequests()[0].status).toBe('sent');
});

test('sendReviewRequests handles non-array input', () => {
  const result = reviewRequestService.sendReviewRequests({
    paperId: 'paper_1',
    reviewerEmails: null,
  });
  expect(result.sent).toHaveLength(0);
  expect(result.failed).toHaveLength(0);
});

test('sendReviewRequests handles missing args', () => {
  const result = reviewRequestService.sendReviewRequests();
  expect(result.sent).toHaveLength(0);
  expect(result.failed).toHaveLength(0);
});

test('clear resets stored requests', () => {
  reviewRequestService.sendReviewRequests({
    paperId: 'paper_1',
    reviewerEmails: ['a@example.com'],
  });
  reviewRequestService.clear();
  expect(reviewRequestService.getRequests()).toHaveLength(0);
});

test('sendReviewRequests records delivery failures', () => {
  reviewRequestService.setDeliveryFailureMode(true);
  const result = reviewRequestService.sendReviewRequests({
    paperId: 'paper_2',
    reviewerEmails: ['b@example.com'],
  });
  expect(result.failed[0].reason).toBe('delivery_failed');
  expect(reviewRequestStore.getRequests()[0].status).toBe('failed');
});

test('sendReviewRequests reports duplicate requests', () => {
  reviewRequestService.sendReviewRequests({
    paperId: 'paper_3',
    reviewerEmails: ['c@example.com'],
  });
  const result = reviewRequestService.sendReviewRequests({
    paperId: 'paper_3',
    reviewerEmails: ['c@example.com'],
  });
  expect(result.failed[0].reason).toBe('duplicate_request');
});

test('sendReviewRequests defaults missing error reason', () => {
  const original = reviewRequestStore.addRequest;
  reviewRequestStore.addRequest = () => {
    throw undefined;
  };
  const result = reviewRequestService.sendReviewRequests({
    paperId: 'paper_3',
    reviewerEmails: ['c@example.com'],
  });
  expect(result.failed[0].reason).toBe('request_failed');
  reviewRequestStore.addRequest = original;
});

test('respondToRequest fails on missing request', () => {
  const result = reviewRequestService.respondToRequest('missing', 'accept');
  expect(result.reason).toBe('not_found');
});

test('respondToRequest blocks already resolved request', () => {
  const request = createReviewRequest({
    id: 'req_1',
    assignmentId: 'asg_1',
    paperId: 'paper_4',
    reviewerEmail: 'd@example.com',
    decision: 'accept',
  });
  reviewRequestStore.addRequest(request);
  const result = reviewRequestService.respondToRequest('req_1', 'accept');
  expect(result.reason).toBe('already_resolved');
});

test('respondToRequest blocks failed delivery request', () => {
  const request = createReviewRequest({
    id: 'req_2',
    assignmentId: 'asg_2',
    paperId: 'paper_5',
    reviewerEmail: 'e@example.com',
    status: 'failed',
  });
  reviewRequestStore.addRequest(request);
  const result = reviewRequestService.respondToRequest('req_2', 'accept');
  expect(result.reason).toBe('delivery_failed');
});

test('respondToRequest rejects invalid decisions', () => {
  const request = createReviewRequest({
    id: 'req_3',
    assignmentId: 'asg_3',
    paperId: 'paper_6',
    reviewerEmail: 'f@example.com',
  });
  reviewRequestStore.addRequest(request);
  const result = reviewRequestService.respondToRequest('req_3', 'maybe');
  expect(result.reason).toBe('invalid_decision');
});

test('respondToRequest records rejection', () => {
  const request = createReviewRequest({
    id: 'req_4',
    assignmentId: 'asg_4',
    paperId: 'paper_7',
    reviewerEmail: 'g@example.com',
  });
  reviewRequestStore.addRequest(request);
  const result = reviewRequestService.respondToRequest('req_4', 'reject');
  expect(result.ok).toBe(true);
  expect(result.request.decision).toBe('reject');
});

test('respondToRequest accepts and creates assignment', () => {
  assignmentStorage.seedPaper({ id: 'paper_8', title: 'Paper', status: 'Submitted' });
  const request = createReviewRequest({
    id: 'req_5',
    assignmentId: 'asg_5',
    paperId: 'paper_8',
    reviewerEmail: 'h@example.com',
  });
  reviewRequestStore.addRequest(request);
  const result = reviewRequestService.respondToRequest('req_5', 'accept');
  expect(result.ok).toBe(true);
  expect(assignmentStore.getActiveCountForReviewer('h@example.com')).toBe(1);
  const updated = assignmentStorage.getPaper('paper_8');
  expect(updated.assignedRefereeEmails).toContain('h@example.com');
});

test('respondToRequest keeps existing email list', () => {
  assignmentStorage.seedPaper({
    id: 'paper_8b',
    title: 'Paper',
    status: 'Submitted',
    assignedRefereeEmails: ['h@example.com'],
    assignmentVersion: 0,
  });
  const request = createReviewRequest({
    id: 'req_5b',
    assignmentId: 'asg_5b',
    paperId: 'paper_8b',
    reviewerEmail: 'h@example.com',
  });
  reviewRequestStore.addRequest(request);
  const result = reviewRequestService.respondToRequest('req_5b', 'accept');
  expect(result.ok).toBe(true);
  const updated = assignmentStorage.getPaper('paper_8b');
  expect(updated.assignedRefereeEmails).toEqual(['h@example.com']);
});

test('respondToRequest handles assignment store failures', () => {
  assignmentStorage.seedPaper({ id: 'paper_9', title: 'Paper', status: 'Submitted' });
  const request = createReviewRequest({
    id: 'req_6',
    assignmentId: 'asg_6',
    paperId: 'paper_9',
    reviewerEmail: 'i@example.com',
  });
  reviewRequestStore.addRequest(request);
  const original = assignmentStore.addAssignment;
  assignmentStore.addAssignment = () => {
    throw new Error('limit_reached');
  };
  const result = reviewRequestService.respondToRequest('req_6', 'accept');
  expect(result.reason).toBe('limit_reached');
  assignmentStore.addAssignment = original;
});

test('respondToRequest handles assignment store failures without message', () => {
  assignmentStorage.seedPaper({ id: 'paper_9b', title: 'Paper', status: 'Submitted' });
  const request = createReviewRequest({
    id: 'req_6b',
    assignmentId: 'asg_6b',
    paperId: 'paper_9b',
    reviewerEmail: 'i2@example.com',
  });
  reviewRequestStore.addRequest(request);
  const original = assignmentStore.addAssignment;
  assignmentStore.addAssignment = () => {
    throw {};
  };
  const result = reviewRequestService.respondToRequest('req_6b', 'accept');
  expect(result.reason).toBe('assignment_failed');
  assignmentStore.addAssignment = original;
});

test('respondToRequest fails when paper missing', () => {
  const request = createReviewRequest({
    id: 'req_7',
    assignmentId: 'asg_7',
    paperId: 'paper_missing',
    reviewerEmail: 'j@example.com',
  });
  reviewRequestStore.addRequest(request);
  const result = reviewRequestService.respondToRequest('req_7', 'accept');
  expect(result.reason).toBe('paper_not_found');
});

test('respondToRequest rolls back on save failure', () => {
  assignmentStorage.seedPaper({ id: 'paper_10', title: 'Paper', status: 'Submitted' });
  assignmentStorage.setFailureMode(true);
  const request = createReviewRequest({
    id: 'req_8',
    assignmentId: 'asg_8',
    paperId: 'paper_10',
    reviewerEmail: 'k@example.com',
  });
  reviewRequestStore.addRequest(request);
  const result = reviewRequestService.respondToRequest('req_8', 'accept');
  expect(result.reason).toBe('assignment_storage_failure');
  expect(assignmentStore.getActiveCountForReviewer('k@example.com')).toBe(0);
  assignmentStorage.setFailureMode(false);
});

test('respondToRequest handles save failure without message', () => {
  assignmentStorage.seedPaper({ id: 'paper_10b', title: 'Paper', status: 'Submitted' });
  const request = createReviewRequest({
    id: 'req_8b',
    assignmentId: 'asg_8b',
    paperId: 'paper_10b',
    reviewerEmail: 'k2@example.com',
  });
  reviewRequestStore.addRequest(request);
  const original = assignmentStorage.saveAssignments;
  assignmentStorage.saveAssignments = () => {
    throw {};
  };
  const result = reviewRequestService.respondToRequest('req_8b', 'accept');
  expect(result.reason).toBe('paper_update_failed');
  assignmentStorage.saveAssignments = original;
});

test('respondToRequest handles non-array assignedRefereeEmails', () => {
  const request = createReviewRequest({
    id: 'req_8c',
    assignmentId: 'asg_8c',
    paperId: 'paper_10c',
    reviewerEmail: 'k3@example.com',
  });
  reviewRequestStore.addRequest(request);
  const customStorage = {
    getPaper: () => ({ id: 'paper_10c', assignedRefereeEmails: null, assignmentVersion: 0 }),
    saveAssignments: jest.fn(),
  };
  const result = reviewRequestService.respondToRequest('req_8c', 'accept', { assignmentStorage: customStorage });
  expect(result.ok).toBe(true);
  expect(customStorage.saveAssignments).toHaveBeenCalledWith({
    paperId: 'paper_10c',
    refereeEmails: ['k3@example.com'],
    expectedVersion: 0,
  });
});
