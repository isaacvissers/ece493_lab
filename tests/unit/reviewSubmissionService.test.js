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
