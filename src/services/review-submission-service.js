import { assignmentStore as defaultAssignmentStore } from './assignment-store.js';
import { reviewFormStore as defaultReviewFormStore } from './review-form-store.js';
import { reviewDraftStore as defaultReviewDraftStore } from './review-draft-store.js';
import { reviewValidationService as defaultReviewValidationService } from './review-validation-service.js';
import { errorLog as defaultErrorLog } from './error-log.js';
import { createSubmittedReview, isSubmittedReviewFinal } from '../models/submitted-review.js';
import { ACCEPTED_REVIEWER_STATUSES } from '../models/reviewer-assignment-status.js';
import { isFormClosed } from '../models/review-form.js';
import { createNotificationLog } from '../models/notification-log.js';

const SUBMISSIONS_KEY = 'cms.submitted_reviews';
const NOTIFICATIONS_KEY = 'cms.notification_log';

let cachedSubmissions = null;
let cachedNotifications = null;
let submissionFailureMode = false;
let notificationFailureMode = false;

function loadSubmissions() {
  if (cachedSubmissions) {
    return cachedSubmissions;
  }
  const raw = localStorage.getItem(SUBMISSIONS_KEY);
  cachedSubmissions = raw ? JSON.parse(raw) : [];
  return cachedSubmissions;
}

function persistSubmissions(submissions) {
  if (submissionFailureMode) {
    throw new Error('submission_save_failed');
  }
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
  cachedSubmissions = submissions;
}

function loadNotifications() {
  if (cachedNotifications) {
    return cachedNotifications;
  }
  const raw = localStorage.getItem(NOTIFICATIONS_KEY);
  cachedNotifications = raw ? JSON.parse(raw) : [];
  return cachedNotifications;
}

function persistNotifications(entries) {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(entries));
  cachedNotifications = entries;
}

function normalizeEmail(email) {
  return (email || '').trim().toLowerCase();
}

function getSubmittedReview(paperId, reviewerEmail) {
  return loadSubmissions().find((entry) => (
    entry.paperId === paperId && entry.reviewerEmail === reviewerEmail
  )) || null;
}

export const reviewSubmissionService = {
  setSubmissionFailureMode(enabled) {
    submissionFailureMode = Boolean(enabled);
  },
  setNotificationFailureMode(enabled) {
    notificationFailureMode = Boolean(enabled);
  },
  reset() {
    submissionFailureMode = false;
    notificationFailureMode = false;
    cachedSubmissions = null;
    cachedNotifications = null;
    localStorage.removeItem(SUBMISSIONS_KEY);
    localStorage.removeItem(NOTIFICATIONS_KEY);
  },
  getSubmissionStatus({ paperId, reviewerEmail } = {}) {
    const normalized = normalizeEmail(reviewerEmail);
    const review = getSubmittedReview(paperId, normalized);
    if (review) {
      return { ok: true, status: 'submitted', submission: review };
    }
    return { ok: false, status: 'draft' };
  },
  submit({
    paperId,
    reviewerEmail,
    content,
    notificationsEnabled = false,
    assignmentStore = defaultAssignmentStore,
    reviewFormStore = defaultReviewFormStore,
    reviewDraftStore = defaultReviewDraftStore,
    reviewValidationService = defaultReviewValidationService,
    errorLog = defaultErrorLog,
  } = {}) {
    const normalized = normalizeEmail(reviewerEmail);

    const assignments = assignmentStore.getAssignments();
    const assignment = assignments.find((entry) => (
      entry && entry.paperId === paperId && entry.reviewerEmail === normalized
    ));
    if (!assignment) {
      return { ok: false, reason: 'not_assigned' };
    }
    if (!ACCEPTED_REVIEWER_STATUSES.includes(assignment.status)) {
      return { ok: false, reason: 'not_accepted' };
    }

    const form = reviewFormStore.getForm(paperId);
    if (!form) {
      return { ok: false, reason: 'form_missing' };
    }
    if (isFormClosed(form)) {
      return { ok: false, reason: 'closed' };
    }

    const existing = getSubmittedReview(paperId, normalized);
    if (existing && isSubmittedReviewFinal(existing)) {
      return { ok: false, reason: 'duplicate' };
    }

    const validation = reviewValidationService.validate({
      content,
      requiredFields: form.requiredFields,
    });
    if (!validation.ok) {
      return { ok: false, reason: 'validation_failed', errors: validation.errors };
    }

    try {
      const submission = createSubmittedReview({ paperId, reviewerEmail: normalized, content });
      const submissions = loadSubmissions().slice();
      submissions.push(submission);
      persistSubmissions(submissions);
    } catch (error) {
      if (errorLog) {
        errorLog.logFailure({
          errorType: 'review_submission_failed',
          message: error && error.message ? error.message : 'submission_failed',
          context: paperId,
        });
      }
      return { ok: false, reason: 'save_failed' };
    }

    if (notificationsEnabled) {
      const status = notificationFailureMode ? 'failed' : 'sent';
      const entries = loadNotifications().slice();
      entries.push(createNotificationLog({ paperId, reviewerEmail: normalized, status }));
      persistNotifications(entries);
      if (status === 'failed' && errorLog) {
        errorLog.logFailure({
          errorType: 'review_notification_failed',
          message: 'notification_failed',
          context: paperId,
        });
      }
      return { ok: true, notified: status === 'sent', notificationStatus: status };
    }

    return { ok: true, notified: false };
  },
  preserveDraft({
    paperId,
    reviewerEmail,
    content,
    errors,
    reviewDraftStore = defaultReviewDraftStore,
  } = {}) {
    try {
      reviewDraftStore.saveDraft({
        paperId,
        reviewerEmail: normalizeEmail(reviewerEmail),
        content,
        validationErrors: errors || null,
      });
      return { ok: true };
    } catch (error) {
      if (defaultErrorLog) {
        defaultErrorLog.logFailure({
          errorType: 'review_draft_preserve_failed',
          message: error && error.message ? error.message : 'draft_preserve_failed',
          context: paperId,
        });
      }
      return { ok: false };
    }
  },
};
