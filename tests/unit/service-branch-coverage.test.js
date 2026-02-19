import { jest } from '@jest/globals';
import { refereeInvitationCheck } from '../../src/services/referee-invitation-check.js';
import { assignmentRules } from '../../src/services/assignment-rules.js';
import { assignmentService } from '../../src/services/assignment-service.js';
import { assignmentStorage } from '../../src/services/assignment-storage.js';
import { adminFlagService as adminFlagServiceWrapper } from '../../src/services/adminFlagService.js';
import { adminFlagService } from '../../src/services/admin-flag-service.js';
import { refereeReadiness } from '../../src/services/referee-readiness.js';
import { reviewDeliveryService } from '../../src/services/review-delivery-service.js';
import { reviewDraftLoad } from '../../src/services/review-draft-load.js';
import { reviewDraftStore } from '../../src/services/review-draft-store.js';
import { reviewFormAccess } from '../../src/services/review-form-access.js';
import { reviewFormStore } from '../../src/services/review-form-store.js';

beforeEach(() => {
  if (typeof localStorage !== 'undefined') {
    localStorage.clear();
  }
  reviewDeliveryService.reset();
  reviewDraftStore.reset();
  reviewFormStore.reset();
  assignmentStorage.reset();
});

test('admin flag service wrapper re-exports implementation', () => {
  expect(adminFlagServiceWrapper).toBe(adminFlagService);
});

test('referee readiness logs fallback message and handles missing invitation check', () => {
  const errorLog = { logFailure: jest.fn() };
  const readinessAudit = { record: jest.fn() };
  const resultError = refereeReadiness.evaluate({
    paperId: 'paper_1',
    refereeCount: { getCount: () => { throw {}; } },
    errorLog,
    readinessAudit,
  });

  expect(resultError.ok).toBe(false);
  expect(errorLog.logFailure).toHaveBeenCalledWith(expect.objectContaining({
    message: 'count_failure',
  }));
  expect(readinessAudit.record).toHaveBeenCalledWith(expect.objectContaining({
    result: 'error',
    reason: 'count_failure',
  }));

  const resultReady = refereeReadiness.evaluate({
    paperId: 'paper_2',
    refereeCount: { getCount: () => 3 },
    invitationCheck: null,
    readinessAudit: null,
  });

  expect(resultReady.ok).toBe(true);
  expect(resultReady.ready).toBe(true);
  expect(resultReady.missingInvitations).toEqual([]);
});

test('referee readiness records audit on ready path', () => {
  const readinessAudit = { record: jest.fn() };
  const result = refereeReadiness.evaluate({
    paperId: 'paper_ready',
    refereeCount: { getCount: () => 3 },
    invitationCheck: { getMissingInvitations: () => ['missing@example.com'] },
    readinessAudit,
  });

  expect(result.ok).toBe(true);
  expect(result.ready).toBe(true);
  expect(readinessAudit.record).toHaveBeenCalledWith(expect.objectContaining({
    result: 'ready',
    reason: 'count_ok',
  }));
});

test('referee invitation check filters invitations by status and decision', () => {
  const result = refereeInvitationCheck.getMissingInvitations({
    paperId: 'paper_1',
    refereeCount: { getNonDeclinedEmails: () => ['a@example.com', 'b@example.com', 'c@example.com'] },
    assignmentStorage: {},
    reviewRequestStore: {
      getRequests: () => [
        { paperId: 'paper_1', reviewerEmail: 'a@example.com', status: 'failed' },
        { paperId: 'paper_2', reviewerEmail: 'b@example.com', status: 'sent' },
        { paperId: 'paper_1', reviewerEmail: 'b@example.com', decision: 'accepted' },
        { paperId: 'paper_1', reviewerEmail: 'c@example.com', status: 'sent' },
      ],
    },
  });

  expect(result).toEqual(['a@example.com']);
});

test('assignment rules skip blank entries', () => {
  const evaluation = assignmentRules.evaluate({
    paperId: 'paper_1',
    reviewerEmails: ['   ', 'valid@example.com'],
    assignmentStore: {
      hasActiveAssignment: () => false,
      getActiveCountForReviewer: () => 0,
    },
  });

  expect(evaluation.candidates).toEqual(['valid@example.com']);
  expect(evaluation.violations).toHaveLength(0);
});

test('review delivery service handles empty storage and non-array editor list', () => {
  expect(reviewDeliveryService.getEditorReviews('missing')).toEqual([]);

  localStorage.setItem('cms.editor_review_list', JSON.stringify({ ed1: 'oops' }));
  const result = reviewDeliveryService.deliverReview({ reviewId: 'rev1', editorId: 'ed1' });
  expect(result.ok).toBe(true);
  expect(reviewDeliveryService.getEditorReviews('ed1')).toHaveLength(1);
});

test('review delivery service loads cached storage and appends to existing editor list', () => {
  localStorage.setItem('cms.review_delivery_events', JSON.stringify([
    { reviewId: 'rev-existing', status: 'delivered' },
  ]));
  localStorage.setItem('cms.editor_review_list', JSON.stringify({
    ed2: [{ reviewId: 'rev-existing', deliveredAt: '2024-01-01T00:00:00.000Z' }],
  }));

  expect(reviewDeliveryService.hasDelivered('rev-existing')).toBe(true);
  reviewDeliveryService.deliverReview({ reviewId: 'rev-new', editorId: 'ed2' });
  expect(reviewDeliveryService.getEditorReviews('ed2')).toHaveLength(2);
});

test('review draft load logs fallback message when error lacks detail', () => {
  const errorLog = { logFailure: jest.fn() };
  const result = reviewDraftLoad.load({
    paperId: 'paper',
    reviewerEmail: 'rev@example.com',
    reviewDraftStore: { getDraft: () => { throw {}; } },
    errorLog,
  });
  expect(result.ok).toBe(false);
  expect(errorLog.logFailure).toHaveBeenCalledWith(expect.objectContaining({
    message: 'draft_load_failed',
  }));
});

test('review draft store loads cached drafts from storage', () => {
  localStorage.setItem('cms.review_drafts', JSON.stringify({
    'paper::rev@example.com': { paperId: 'paper', reviewerEmail: 'rev@example.com', content: { text: 'draft' } },
  }));

  const draft = reviewDraftStore.getDraft('paper', 'rev@example.com');
  expect(draft.content.text).toBe('draft');
});

test('review draft store can fail during persistence', () => {
  reviewDraftStore.setFailureMode(false);
  const draft = {
    get paperId() {
      reviewDraftStore.setFailureMode(true);
      return 'paper';
    },
    reviewerEmail: 'rev@example.com',
    content: {},
  };
  expect(() => reviewDraftStore.saveDraft(draft)).toThrow('draft_store_failure');
  reviewDraftStore.setFailureMode(false);
});

test('review form access normalizes email and logs fallback failure messages', () => {
  const errorLog = { logFailure: jest.fn() };
  const assignmentStore = {
    getAssignments: () => [
      { paperId: 'paper_1', reviewerEmail: 'rev@example.com', status: 'accepted' },
    ],
  };
  const assignmentStoreFor = (paperId) => ({
    getAssignments: () => [
      { paperId, reviewerEmail: 'rev@example.com', status: 'accepted' },
    ],
  });

  const accessOk = reviewFormAccess.getForm({
    paperId: 'paper_1',
    reviewerEmail: ' ReV@Example.com ',
    assignmentStore,
    reviewFormStore: { getForm: () => ({ paperId: 'paper_1', status: 'active' }) },
    reviewDraftStore: { getDraft: () => null },
  });
  expect(accessOk.ok).toBe(true);

  const assignmentFail = reviewFormAccess.getForm({
    paperId: 'paper_2',
    reviewerEmail: 'rev@example.com',
    assignmentStore: { getAssignments: () => { throw {}; } },
    errorLog,
  });
  expect(assignmentFail.reason).toBe('assignment_lookup_failed');
  expect(errorLog.logFailure).toHaveBeenCalledWith(expect.objectContaining({
    message: 'assignment_lookup_failed',
  }));

  const formFail = reviewFormAccess.getForm({
    paperId: 'paper_3',
    reviewerEmail: 'rev@example.com',
    assignmentStore: assignmentStoreFor('paper_3'),
    reviewFormStore: { getForm: () => { throw {}; } },
    errorLog,
  });
  expect(formFail.reason).toBe('form_failure');
  expect(errorLog.logFailure).toHaveBeenCalledWith(expect.objectContaining({
    message: 'form_load_failed',
  }));

  const draftFail = reviewFormAccess.getForm({
    paperId: 'paper_4',
    reviewerEmail: 'rev@example.com',
    assignmentStore: assignmentStoreFor('paper_4'),
    reviewFormStore: { getForm: () => ({ paperId: 'paper_4', status: 'active' }) },
    reviewDraftStore: { getDraft: () => { throw {}; } },
    errorLog,
  });
  expect(draftFail.reason).toBe('draft_failure');
  expect(errorLog.logFailure).toHaveBeenCalledWith(expect.objectContaining({
    message: 'draft_load_failed',
  }));

  const errorLogWithMessage = { logFailure: jest.fn() };
  const formFailMessage = reviewFormAccess.getForm({
    paperId: 'paper_6',
    reviewerEmail: 'rev@example.com',
    assignmentStore: assignmentStoreFor('paper_6'),
    reviewFormStore: { getForm: () => { throw new Error('form_boom'); } },
    errorLog: errorLogWithMessage,
  });
  expect(formFailMessage.reason).toBe('form_failure');
  expect(errorLogWithMessage.logFailure).toHaveBeenCalledWith(expect.objectContaining({
    message: 'form_boom',
  }));

  const errorLogDraftMessage = { logFailure: jest.fn() };
  const draftFailMessage = reviewFormAccess.getForm({
    paperId: 'paper_7',
    reviewerEmail: 'rev@example.com',
    assignmentStore: assignmentStoreFor('paper_7'),
    reviewFormStore: { getForm: () => ({ paperId: 'paper_7', status: 'active' }) },
    reviewDraftStore: { getDraft: () => { throw new Error('draft_boom'); } },
    errorLog: errorLogDraftMessage,
  });
  expect(draftFailMessage.reason).toBe('draft_failure');
  expect(errorLogDraftMessage.logFailure).toHaveBeenCalledWith(expect.objectContaining({
    message: 'draft_boom',
  }));

  const noLog = reviewFormAccess.getForm({
    paperId: 'paper_5',
    reviewerEmail: 'rev@example.com',
    assignmentStore: { getAssignments: () => { throw {}; } },
    errorLog: null,
  });
  expect(noLog.reason).toBe('assignment_lookup_failed');
});

test('review form store loads cached forms from storage', () => {
  localStorage.setItem('cms.review_forms', JSON.stringify([{ paperId: 'paper_x' }]));
  expect(reviewFormStore.getForm('paper_x')).toEqual({ paperId: 'paper_x' });
});

test('review form store can fail during persistence', () => {
  reviewFormStore.setFailureMode(false);
  const originalPush = Array.prototype.push;
  Array.prototype.push = function patchedPush(...args) {
    reviewFormStore.setFailureMode(true);
    return originalPush.apply(this, args);
  };

  try {
    expect(() => reviewFormStore.saveForm({ paperId: 'paper' })).toThrow('form_store_failure');
  } finally {
    Array.prototype.push = originalPush;
    reviewFormStore.setFailureMode(false);
  }
});

test('assignment service reports guard evaluation failures', () => {
  const result = assignmentService.submitAssignments({
    paperId: 'paper_guard',
    reviewerEmails: ['reviewer@example.com'],
    assignmentGuard: { canAssign: () => { throw new Error('boom'); } },
  });

  expect(result.ok).toBe(false);
  expect(result.failure).toBe('evaluation_failed');
});

test('assignment storage rejects concurrent updates', () => {
  assignmentStorage.seedPaper({ id: 'paper_concurrent', status: 'submitted', assignmentVersion: 0 });
  expect(() => assignmentStorage.updatePaperStatus({
    paperId: 'paper_concurrent',
    status: 'eligible',
    expectedVersion: 1,
  })).toThrow('concurrent_change');
});
