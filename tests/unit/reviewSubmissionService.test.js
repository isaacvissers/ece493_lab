import { jest } from '@jest/globals';
import { reviewSubmissionService } from '../../src/services/review-submission-service.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { reviewFormStore } from '../../src/services/review-form-store.js';
import { reviewDraftStore } from '../../src/services/review-draft-store.js';
import { errorLog } from '../../src/services/error-log.js';
import { createAssignment } from '../../src/models/assignment.js';
import { createReviewForm } from '../../src/models/review-form.js';
import { REQUIRED_REVIEW_FIELDS } from '../../src/models/review-constants.js';

const content = {
  summary: 'Summary',
  commentsToAuthors: 'Comments',
  recommendation: 'accept',
  confidenceRating: 4,
};

beforeEach(() => {
  assignmentStore.reset();
  reviewFormStore.reset();
  reviewDraftStore.reset();
  reviewSubmissionService.reset();
  errorLog.clear();
});

test('submits review and records status', () => {
  assignmentStore.addAssignment(createAssignment({
    paperId: 'paper_1',
    reviewerEmail: 'rev@example.com',
    status: 'accepted',
  }));
  reviewFormStore.saveForm(createReviewForm({
    paperId: 'paper_1',
    status: 'active',
    requiredFields: REQUIRED_REVIEW_FIELDS,
  }));

  const result = reviewSubmissionService.submit({
    paperId: 'paper_1',
    reviewerEmail: 'rev@example.com',
    content,
  });

  expect(result.ok).toBe(true);
  expect(result.notified).toBe(false);

  const status = reviewSubmissionService.getSubmissionStatus({
    paperId: 'paper_1',
    reviewerEmail: 'rev@example.com',
  });
  expect(status.ok).toBe(true);
  expect(status.status).toBe('submitted');
});

test('logs notification when enabled', () => {
  assignmentStore.addAssignment(createAssignment({
    paperId: 'paper_2',
    reviewerEmail: 'rev@example.com',
    status: 'accepted',
  }));
  reviewFormStore.saveForm(createReviewForm({
    paperId: 'paper_2',
    status: 'active',
    requiredFields: REQUIRED_REVIEW_FIELDS,
  }));

  const result = reviewSubmissionService.submit({
    paperId: 'paper_2',
    reviewerEmail: 'rev@example.com',
    content,
    notificationsEnabled: true,
  });

  expect(result.ok).toBe(true);
  expect(result.notificationStatus).toBe('sent');

  const raw = localStorage.getItem('cms.notification_log');
  const entries = raw ? JSON.parse(raw) : [];
  expect(entries).toHaveLength(1);
});

test('uses cached notification log on subsequent notifications', () => {
  assignmentStore.addAssignment(createAssignment({
    paperId: 'paper_3',
    reviewerEmail: 'rev@example.com',
    status: 'accepted',
  }));
  assignmentStore.addAssignment(createAssignment({
    paperId: 'paper_4',
    reviewerEmail: 'rev@example.com',
    status: 'accepted',
  }));
  reviewFormStore.saveForm(createReviewForm({
    paperId: 'paper_3',
    status: 'active',
    requiredFields: REQUIRED_REVIEW_FIELDS,
  }));
  reviewFormStore.saveForm(createReviewForm({
    paperId: 'paper_4',
    status: 'active',
    requiredFields: REQUIRED_REVIEW_FIELDS,
  }));

  const first = reviewSubmissionService.submit({
    paperId: 'paper_3',
    reviewerEmail: 'rev@example.com',
    content,
    notificationsEnabled: true,
  });
  expect(first.ok).toBe(true);

  const second = reviewSubmissionService.submit({
    paperId: 'paper_4',
    reviewerEmail: 'rev@example.com',
    content,
    notificationsEnabled: true,
  });
  expect(second.ok).toBe(true);

  const raw = localStorage.getItem('cms.notification_log');
  const entries = raw ? JSON.parse(raw) : [];
  expect(entries).toHaveLength(2);
});

test('loads submissions from storage when cached list is empty', () => {
  localStorage.setItem('cms.submitted_reviews', JSON.stringify([
    { paperId: 'paper_storage', reviewerEmail: 'rev@example.com', status: 'submitted' },
  ]));

  const status = reviewSubmissionService.getSubmissionStatus({
    paperId: 'paper_storage',
    reviewerEmail: 'rev@example.com',
  });
  expect(status.ok).toBe(true);
});

test('loads notification log from storage when cached list is empty', () => {
  assignmentStore.addAssignment(createAssignment({
    paperId: 'paper_notify',
    reviewerEmail: 'rev@example.com',
    status: 'accepted',
  }));
  reviewFormStore.saveForm(createReviewForm({
    paperId: 'paper_notify',
    status: 'active',
    requiredFields: REQUIRED_REVIEW_FIELDS,
  }));

  localStorage.setItem('cms.notification_log', JSON.stringify([
    { paperId: 'paper_notify', reviewerEmail: 'rev@example.com', status: 'sent' },
  ]));

  const result = reviewSubmissionService.submit({
    paperId: 'paper_notify',
    reviewerEmail: 'rev@example.com',
    content,
    notificationsEnabled: true,
  });
  expect(result.ok).toBe(true);
  const entries = JSON.parse(localStorage.getItem('cms.notification_log'));
  expect(entries).toHaveLength(2);
});

test('logs submission failure with error message', () => {
  const errorLog = { logFailure: jest.fn() };
  assignmentStore.addAssignment(createAssignment({
    paperId: 'paper_fail_log',
    reviewerEmail: 'rev@example.com',
    status: 'accepted',
  }));
  reviewFormStore.saveForm(createReviewForm({
    paperId: 'paper_fail_log',
    status: 'active',
    requiredFields: REQUIRED_REVIEW_FIELDS,
  }));

  reviewSubmissionService.setSubmissionFailureMode(true);
  const result = reviewSubmissionService.submit({
    paperId: 'paper_fail_log',
    reviewerEmail: 'rev@example.com',
    content,
    errorLog,
  });
  reviewSubmissionService.setSubmissionFailureMode(false);

  expect(result.ok).toBe(false);
  expect(errorLog.logFailure).toHaveBeenCalledWith(expect.objectContaining({
    message: 'submission_save_failed',
  }));
});

test('uses cached submission list and fallback error message on save failure', () => {
  assignmentStore.addAssignment(createAssignment({
    paperId: 'paper_cache',
    reviewerEmail: 'rev@example.com',
    status: 'accepted',
  }));
  reviewFormStore.saveForm(createReviewForm({
    paperId: 'paper_cache',
    status: 'active',
    requiredFields: REQUIRED_REVIEW_FIELDS,
  }));

  const first = reviewSubmissionService.submit({
    paperId: 'paper_cache',
    reviewerEmail: 'rev@example.com',
    content,
  });
  expect(first.ok).toBe(true);

  const errorLog = { logFailure: jest.fn() };
  assignmentStore.addAssignment(createAssignment({
    paperId: 'paper_cache_2',
    reviewerEmail: 'rev@example.com',
    status: 'accepted',
  }));
  reviewFormStore.saveForm(createReviewForm({
    paperId: 'paper_cache_2',
    status: 'active',
    requiredFields: REQUIRED_REVIEW_FIELDS,
  }));

  reviewSubmissionService.setSubmissionFailureMode(true);
  const result = reviewSubmissionService.submit({
    paperId: 'paper_cache_2',
    reviewerEmail: 'rev@example.com',
    content,
    errorLog,
  });
  reviewSubmissionService.setSubmissionFailureMode(false);

  expect(result.ok).toBe(false);
  expect(errorLog.logFailure).toHaveBeenCalledWith(expect.objectContaining({
    message: 'submission_save_failed',
  }));
});

test('returns cached status after first submission', () => {
  assignmentStore.addAssignment(createAssignment({
    paperId: 'paper_status',
    reviewerEmail: 'rev@example.com',
    status: 'accepted',
  }));
  reviewFormStore.saveForm(createReviewForm({
    paperId: 'paper_status',
    status: 'active',
    requiredFields: REQUIRED_REVIEW_FIELDS,
  }));

  reviewSubmissionService.submit({
    paperId: 'paper_status',
    reviewerEmail: 'rev@example.com',
    content,
  });

  const status = reviewSubmissionService.getSubmissionStatus({
    paperId: 'paper_status',
    reviewerEmail: 'rev@example.com',
  });
  expect(status.ok).toBe(true);
});
