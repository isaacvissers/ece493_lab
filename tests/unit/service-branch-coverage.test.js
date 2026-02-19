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
import { validationRulesService } from '../../src/services/validation-rules-service.js';
import { overassignmentAlert } from '../../src/services/overassignment-alert.js';

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

test('referee readiness records audit on blocked count path', () => {
  const readinessAudit = { record: jest.fn() };
  const result = refereeReadiness.evaluate({
    paperId: 'paper_blocked',
    refereeCount: { getCount: () => 1 },
    readinessAudit,
  });

  expect(result.ok).toBe(true);
  expect(result.ready).toBe(false);
  expect(readinessAudit.record).toHaveBeenCalledWith(expect.objectContaining({
    result: 'blocked',
    reason: 'count_low',
  }));
});

test('referee readiness handles missing inputs with default options', () => {
  const result = refereeReadiness.evaluate();
  expect(result.ok).toBe(true);
  expect(result.ready).toBe(false);
});

test('referee readiness handles count failure with error message', () => {
  const errorLog = { logFailure: jest.fn() };
  const readinessAudit = { record: jest.fn() };
  const result = refereeReadiness.evaluate({
    paperId: 'paper_error',
    refereeCount: { getCount: () => { throw new Error('count_boom'); } },
    errorLog,
    readinessAudit,
  });

  expect(result.ok).toBe(false);
  expect(result.reason).toBe('count_failure');
  expect(errorLog.logFailure).toHaveBeenCalledWith(expect.objectContaining({
    message: 'count_boom',
  }));
});

test('referee readiness can be evaluated with defaults', () => {
  const result = refereeReadiness.evaluate();
  expect(result).toHaveProperty('ok');
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

test('referee invitation check includes pending requests without decision or sent', () => {
  const result = refereeInvitationCheck.getMissingInvitations({
    paperId: 'paper_2',
    refereeCount: { getNonDeclinedEmails: () => ['x@example.com'] },
    assignmentStorage: {},
    reviewRequestStore: {
      getRequests: () => [
        { paperId: 'paper_2', reviewerEmail: 'x@example.com', status: 'pending' },
      ],
    },
  });

  expect(result).toEqual(['x@example.com']);
});

test('referee invitation check ignores invitations when disabled', () => {
  const result = refereeInvitationCheck.getMissingInvitations({
    paperId: 'paper_3',
    invitationsEnabled: false,
    refereeCount: { getNonDeclinedEmails: () => ['y@example.com'] },
    assignmentStorage: {},
    reviewRequestStore: { getRequests: () => [] },
  });

  expect(result).toEqual([]);
});

test('referee invitation check includes sent invitations as invited', () => {
  const result = refereeInvitationCheck.getMissingInvitations({
    paperId: 'paper_4',
    refereeCount: { getNonDeclinedEmails: () => ['z@example.com'] },
    assignmentStorage: {},
    reviewRequestStore: {
      getRequests: () => [
        { paperId: 'paper_4', reviewerEmail: 'z@example.com', status: 'sent' },
      ],
    },
  });

  expect(result).toEqual([]);
});

test('referee invitation check returns list with default services', () => {
  const result = refereeInvitationCheck.getMissingInvitations();
  expect(Array.isArray(result)).toBe(true);
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

test('assignment rules handle null reviewer emails list', () => {
  const evaluation = assignmentRules.evaluate({
    paperId: 'paper_null',
    reviewerEmails: null,
    assignmentStore: {
      hasActiveAssignment: () => false,
      getActiveCountForReviewer: () => 0,
    },
  });

  expect(evaluation.candidates).toEqual([]);
  expect(evaluation.violations).toEqual([]);
});

test('assignment rules handle undefined reviewer emails list', () => {
  const evaluation = assignmentRules.evaluate({
    paperId: 'paper_undef',
    assignmentStore: {
      hasActiveAssignment: () => false,
      getActiveCountForReviewer: () => 0,
    },
  });

  expect(evaluation.candidates).toEqual([]);
  expect(evaluation.violations).toEqual([]);
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

test('review form access handles blank reviewer email string and error log null paths', () => {
  const assignmentStore = {
    getAssignments: () => [],
  };
  const blankEmailResult = reviewFormAccess.getForm({
    paperId: 'paper_blank',
    reviewerEmail: '   ',
    assignmentStore,
    reviewFormStore: { getForm: () => ({ paperId: 'paper_blank', status: 'active' }) },
    reviewDraftStore: { getDraft: () => null },
  });
  expect(blankEmailResult.reason).toBe('not_assigned');

  const formFailNoLog = reviewFormAccess.getForm({
    paperId: 'paper_6',
    reviewerEmail: 'rev@example.com',
    assignmentStore: {
      getAssignments: () => [
        { paperId: 'paper_6', reviewerEmail: 'rev@example.com', status: 'accepted' },
      ],
    },
    reviewFormStore: { getForm: () => { throw new Error('boom'); } },
    errorLog: null,
  });
  expect(formFailNoLog.reason).toBe('form_failure');

  const draftFailNoLog = reviewFormAccess.getForm({
    paperId: 'paper_7',
    reviewerEmail: 'rev@example.com',
    assignmentStore: {
      getAssignments: () => [
        { paperId: 'paper_7', reviewerEmail: 'rev@example.com', status: 'accepted' },
      ],
    },
    reviewFormStore: { getForm: () => ({ paperId: 'paper_7', status: 'active' }) },
    reviewDraftStore: { getDraft: () => { throw new Error('boom'); } },
    errorLog: null,
  });
  expect(draftFailNoLog.reason).toBe('draft_failure');
});

test('review form access normalizes null reviewer email to empty string', () => {
  const result = reviewFormAccess.getForm({
    paperId: 'paper_8',
    reviewerEmail: null,
  });
  expect(result.reason).toBe('unauthorized');
});

test('review form access normalizes reviewer email casing', () => {
  const result = reviewFormAccess.getForm({
    paperId: 'paper_9',
    reviewerEmail: 'REV@EXAMPLE.COM',
    assignmentStore: {
      getAssignments: () => [
        { paperId: 'paper_9', reviewerEmail: 'rev@example.com', status: 'accepted' },
      ],
    },
    reviewFormStore: { getForm: () => ({ paperId: 'paper_9', status: 'active' }) },
    reviewDraftStore: { getDraft: () => null },
  });
  expect(result.ok).toBe(true);
});

test('review form access handles missing parameters', () => {
  const result = reviewFormAccess.getForm();
  expect(result.reason).toBe('unauthorized');
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

test('validation rules service logs fallback error when exception lacks message', () => {
  const errorLog = { logFailure: jest.fn() };
  const result = validationRulesService.getRules({
    formId: 'form_1',
    reviewFormStore: { getForm: () => { throw {}; } },
    errorLog,
  });

  expect(result.ok).toBe(false);
  expect(errorLog.logFailure).toHaveBeenCalledWith(expect.objectContaining({
    message: 'validation_rules_error',
  }));
});

test('validation rules service handles error message and missing error log', () => {
  const resultWithMessage = validationRulesService.getRules({
    formId: 'form_2',
    reviewFormStore: { getForm: () => { throw new Error('rules_boom'); } },
    errorLog: { logFailure: jest.fn() },
  });
  expect(resultWithMessage.ok).toBe(false);

  const resultNoLog = validationRulesService.getRules({
    formId: 'form_3',
    reviewFormStore: { getForm: () => null },
    errorLog: null,
  });
  expect(resultNoLog.ok).toBe(false);
});

test('validation rules service returns rules when form data is available', () => {
  const result = validationRulesService.getRules({
    formId: 'form_4',
    reviewFormStore: { getForm: () => ({ requiredFields: ['summary'], maxLengths: {}, allowedCharactersRule: 'allow_all' }) },
    errorLog: null,
  });

  expect(result.ok).toBe(true);
  expect(result.rules.requiredFields).toContain('summary');
});

test('validation rules service can be called with defaults', () => {
  const result = validationRulesService.getRules();
  expect(result.ok).toBe(false);
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

test('overassignment alert uses default guidance when null provided', () => {
  const result = overassignmentAlert.build({ count: 3, blocked: [], guidanceAction: null });
  expect(result.message).toContain('Remove/unassign');
});

test('overassignment alert builds message with defaults', () => {
  const result = overassignmentAlert.build();
  expect(result.message).toContain('Over-assignment blocked');
});

test('assignment storage rejects concurrent updates', () => {
  assignmentStorage.seedPaper({ id: 'paper_concurrent', status: 'submitted', assignmentVersion: 0 });
  expect(() => assignmentStorage.updatePaperStatus({
    paperId: 'paper_concurrent',
    status: 'eligible',
    expectedVersion: 1,
  })).toThrow('concurrent_change');
});
