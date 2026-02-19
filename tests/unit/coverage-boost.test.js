import { jest } from '@jest/globals';
import { authController } from '../../src/controllers/auth-controller.js';
import { createEditorReviewAccessController } from '../../src/controllers/editor-review-access-controller.js';
import { createReviewNotificationController } from '../../src/controllers/review-notification-controller.js';
import { createReviewStatusController } from '../../src/controllers/review-status-controller.js';
import { createReviewFormController } from '../../src/controllers/review-form-controller.js';
import { createReviewSubmissionController } from '../../src/controllers/review-submission-controller.js';
import { createReviewValidationController } from '../../src/controllers/review-validation-controller.js';
import { createReviewReadinessController } from '../../src/controllers/review-readiness-controller.js';
import { createReviewWorkflowController } from '../../src/controllers/review-workflow-controller.js';
import { createReviewerAssignmentsController } from '../../src/controllers/reviewer-assignments-controller.js';
import { createReviewerPaperController } from '../../src/controllers/reviewer-paper-controller.js';
import { createReviewSubmitController } from '../../src/controllers/review-submit-controller.js';
import { createAdminNotificationResendController } from '../../src/controllers/admin-notification-resend-controller.js';

import { createAuditLog } from '../../src/models/audit-log.js';
import { createDeliveryEvent } from '../../src/models/delivery-event.js';
import { createEditor, hasEditorPermission } from '../../src/models/editor.js';
import { createNotification } from '../../src/models/notification.js';
import { createPaper, isPaperAvailable } from '../../src/models/paper.js';
import { createReview, isSubmittedReview } from '../../src/models/review.js';
import { createReviewDraft } from '../../src/models/review-draft.js';
import { createReviewForm } from '../../src/models/review-form.js';
import { createValidationError } from '../../src/models/validation-error.js';
import { createValidationRuleSet, loadValidationRuleSet } from '../../src/models/validation-rule-set.js';
import { createNotificationLogEntry } from '../../src/models/notification-log.js';

import '../../src/models/AuditLog.js';
import '../../src/models/DeliveryEvent.js';
import '../../src/models/Editor.js';
import '../../src/models/Notification.js';
import '../../src/models/Paper.js';
import '../../src/models/Review.js';
import '../../src/models/ReviewDraft.js';
import '../../src/models/ReviewForm.js';
import '../../src/models/ValidationError.js';
import '../../src/models/ValidationRuleSet.js';
import '../../src/models/reviewConstants.js';
import '../../src/models/validationConstants.js';
import '../../src/models/deliveryConstants.js';

import { adminFlagService } from '../../src/services/admin-flag-service.js';
import { auditLogService } from '../../src/services/audit-log-service.js';
import { notificationService } from '../../src/services/notification-service.js';
import { notificationConfigService } from '../../src/services/notification-config-service.js';
import { reviewDeliveryService } from '../../src/services/review-delivery-service.js';
import { reviewStorageService } from '../../src/services/review-storage-service.js';
import { reviewDraftLoad } from '../../src/services/review-draft-load.js';
import { reviewFormAccess } from '../../src/services/review-form-access.js';
import { reviewFormStore } from '../../src/services/review-form-store.js';
import { reviewDraftStore } from '../../src/services/review-draft-store.js';
import { reviewStatusService } from '../../src/services/review-status-service.js';
import { validationRulesService } from '../../src/services/validation-rules-service.js';
import { reviewValidationService } from '../../src/services/review-validation-service.js';
import { reviewSubmissionService } from '../../src/services/review-submission-service.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { reviewFormStore as defaultReviewFormStore } from '../../src/services/review-form-store.js';
import { reviewDraftStore as defaultReviewDraftStore } from '../../src/services/review-draft-store.js';
import { errorLog } from '../../src/services/error-log.js';
import { reviewerBatchAssign } from '../../src/services/reviewer-batch-assign.js';
import { reviewerCount } from '../../src/services/reviewer-count.js';
import { refereeCount } from '../../src/services/referee-count.js';
import { overassignmentCheck } from '../../src/services/overassignment-check.js';
import { readinessAudit } from '../../src/services/readiness-audit.js';
import { refereeGuidance } from '../../src/services/referee-guidance.js';
import { refereeInvitationCheck } from '../../src/services/referee-invitation-check.js';
import { reviewerPaperAccess } from '../../src/services/reviewer-paper-access.js';

import { createAdminFlagQueueView } from '../../src/views/admin-flag-queue-view.js';
import { editorAccessibility } from '../../src/views/editor-accessibility.js';
import { createEditorNotificationsView } from '../../src/views/editor-notifications-view.js';
import { createEditorReviewListView } from '../../src/views/editor-review-list-view.js';
import { createReviewErrorSummaryView } from '../../src/views/review-error-summary-view.js';
import { reviewFormAccessibility } from '../../src/views/review-form-accessibility.js';
import { createReviewFormErrorSummaryView } from '../../src/views/review-form-error-summary-view.js';
import { createReviewFormValidationView } from '../../src/views/review-form-validation-view.js';
import { createReviewFormView } from '../../src/views/review-form-view.js';
import { createReviewSubmissionView } from '../../src/views/review-submission-view.js';
import { reviewValidationAccessibility } from '../../src/views/review-validation-accessibility.js';
import { createReviewValidationView } from '../../src/views/review-validation-view.js';

import '../../src/views/adminFlagQueueView.js';
import '../../src/views/editorAccessibility.js';
import '../../src/views/editorNotificationsView.js';
import '../../src/views/editorReviewListView.js';
import '../../src/views/reviewErrorSummaryView.js';
import '../../src/views/reviewValidationAccessibility.js';
import '../../src/views/reviewValidationView.js';

beforeEach(() => {
  adminFlagService.reset();
  auditLogService.reset();
  notificationService.clear();
  reviewDeliveryService.reset();
  reviewStorageService.reset();
  reviewFormStore.reset();
  reviewDraftStore.reset();
  assignmentStore.reset();
  errorLog.clear();
  document.body.innerHTML = '';
});

test('authController pending state flow', () => {
  authController.requestLogin({ destination: 'dest', payload: { id: 1 } });
  expect(authController.getPending().destination).toBe('dest');
  authController.clearPending();
  expect(authController.getPending()).toBeNull();
});

test('editor access controller handles permission and denial', () => {
  const editor = createEditor({ editorId: 'editor_1', permissions: ['review_access'] });
  const controller = createEditorReviewAccessController({ editor });
  expect(controller.canAccess()).toBe(true);
  expect(hasEditorPermission(null, 'review_access')).toBe(false);
});

test('review notification controller uses notification service', () => {
  const mockService = { sendReviewNotifications: jest.fn(() => ({ ok: true })) };
  const controller = createReviewNotificationController({ reviewId: 'rev', editorId: 'editor', notificationService: mockService });
  controller.send();
  expect(mockService.sendReviewNotifications).toHaveBeenCalled();
});

test('review status controller handles not found', () => {
  const view = { setStatus: jest.fn() };
  const controller = createReviewStatusController({
    view,
    sessionState: { getCurrentUser: () => ({ email: 'a@example.com' }) },
    paperId: 'paper_x',
    reviewStatusService: { getStatus: () => ({ ok: false }) },
  });
  controller.init();
  expect(view.setStatus).toHaveBeenCalledWith('Review status not found.', true);
});

test('review form controller branches', () => {
  const view = { setStatus: jest.fn(), setForm: jest.fn(), setDraft: jest.fn(), setViewOnly: jest.fn() };
  const session = { isAuthenticated: () => true, getCurrentUser: () => ({ email: 'a@example.com' }) };

  const controllerNotAssigned = createReviewFormController({
    view,
    sessionState: session,
    paperId: 'paper_1',
    reviewFormAccess: { getForm: () => ({ ok: false, reason: 'not_assigned' }) },
  });
  controllerNotAssigned.init();
  const controllerMissing = createReviewFormController({
    view,
    sessionState: session,
    paperId: 'paper_2',
    reviewFormAccess: { getForm: () => ({ ok: false, reason: 'form_missing' }) },
  });
  controllerMissing.init();
  const controllerOk = createReviewFormController({
    view,
    sessionState: session,
    paperId: 'paper_3',
    reviewFormAccess: { getForm: () => ({ ok: true, form: { paperId: 'paper_3' }, draft: null, viewOnly: false }) },
  });
  controllerOk.init();
  const controllerUnauth = createReviewFormController({
    view,
    sessionState: { isAuthenticated: () => false, getCurrentUser: () => null },
    paperId: 'paper_4',
    reviewFormAccess: { getForm: () => ({ ok: false }) },
  });
  controllerUnauth.init();
});

test('review submission controller handles key branches', () => {
  const formView = createReviewFormView();
  const submissionView = createReviewSubmissionView();
  const validationView = createReviewFormValidationView(formView.element.querySelector('form'));
  const errorSummaryView = createReviewFormErrorSummaryView(formView.element);
  document.body.appendChild(formView.element);
  document.body.appendChild(submissionView.element);

  const session = { isAuthenticated: () => false, getCurrentUser: () => null };
  const controllerAuth = createReviewSubmissionController({
    formView,
    submissionView,
    validationView,
    errorSummaryView,
    sessionState: session,
    paperId: 'paper_1',
  });
  controllerAuth.init();
  formView.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  const sessionOk = { isAuthenticated: () => true, getCurrentUser: () => ({ email: 'rev@example.com' }) };
  const controllerValidation = createReviewSubmissionController({
    formView,
    submissionView,
    validationView,
    errorSummaryView,
    sessionState: sessionOk,
    paperId: 'paper_2',
    reviewValidationService: { validate: () => ({ ok: false, errors: { summary: 'required' } }) },
    reviewSubmissionService: { preserveDraft: () => ({ ok: true }) },
  });
  controllerValidation.init();
  formView.element.querySelector('#review-confirm').checked = true;
  formView.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  const controllerDuplicate = createReviewSubmissionController({
    formView,
    submissionView,
    validationView,
    errorSummaryView,
    sessionState: sessionOk,
    paperId: 'paper_3',
    reviewValidationService: { validate: () => ({ ok: true, errors: {} }) },
    reviewSubmissionService: { submit: () => ({ ok: false, reason: 'duplicate' }), preserveDraft: () => ({ ok: true }) },
  });
  controllerDuplicate.init();
  formView.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  const controllerSuccess = createReviewSubmissionController({
    formView,
    submissionView,
    validationView,
    errorSummaryView,
    sessionState: sessionOk,
    paperId: 'paper_4',
    reviewValidationService: { validate: () => ({ ok: true, errors: {} }) },
    reviewSubmissionService: { submit: () => ({ ok: true, notificationStatus: 'failed' }) },
  });
  controllerSuccess.init();
  formView.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
});

test('review validation controller covers error and success paths', () => {
  const view = createReviewValidationView();
  const summaryView = createReviewErrorSummaryView(view.element);
  document.body.appendChild(view.element);

  const controllerRules = createReviewValidationController({
    view,
    summaryView,
    formId: 'form_x',
    validationRulesService: { getRules: () => ({ ok: false }) },
  });
  controllerRules.init();
  view.element.querySelector('#save-draft').click();

  const controllerValidation = createReviewValidationController({
    view,
    summaryView,
    formId: 'form_y',
    validationRulesService: { getRules: () => ({ ok: true, rules: { requiredFields: ['summary'], maxLengths: {}, invalidCharacterPolicy: 'no_control_chars_no_markup' } }) },
    reviewValidationService: { validate: () => ({ ok: false, errors: { summary: 'required' }, messages: { summary: 'Summary is required.' } }) },
  });
  controllerValidation.init();
  view.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  const controllerStorage = createReviewValidationController({
    view,
    summaryView,
    formId: 'form_z',
    validationRulesService: { getRules: () => ({ ok: true, rules: { requiredFields: [], maxLengths: {}, invalidCharacterPolicy: 'no_control_chars_no_markup' } }) },
    reviewValidationService: { validate: () => ({ ok: true, errors: {} }) },
    reviewStorageService: { saveDraft: () => { throw new Error('fail'); } },
  });
  controllerStorage.init();
  view.element.querySelector('#save-draft').click();
});

test('review readiness controller branches', () => {
  const view = {
    setStatus: jest.fn(),
    setPaper: jest.fn(),
    setMissingInvitations: jest.fn(),
    setGuidance: jest.fn(),
    setCount: jest.fn(),
    setAuthorizationMessage: jest.fn(),
  };
  const guidanceView = { setGuidance: jest.fn(), onAction: jest.fn() };
  const session = { isAuthenticated: () => true, getCurrentUser: () => ({ role: 'Editor' }) };
  const assignmentStorage = { getPaper: () => ({ id: 'paper_1' }) };
  const reviewRequestStore = {};

  const controllerReady = createReviewReadinessController({
    view,
    guidanceView,
    assignmentStorage,
    reviewRequestStore,
    sessionState: session,
    paperId: 'paper_1',
    readinessService: { evaluate: () => ({ ok: true, ready: true, count: 3 }) },
    guidanceService: { getGuidance: () => null },
  });
  controllerReady.init();
  controllerReady.evaluateReadiness();

  const controllerNotReady = createReviewReadinessController({
    view,
    guidanceView,
    assignmentStorage,
    reviewRequestStore,
    sessionState: session,
    paperId: 'paper_2',
    readinessService: { evaluate: () => ({ ok: true, ready: false, count: 1, missingInvitations: ['a@example.com'] }) },
    guidanceService: { getGuidance: () => ({ message: 'Add', actionLabel: 'Add', action: 'add' }) },
  });
  controllerNotReady.evaluateReadiness();

  const controllerUnauth = createReviewReadinessController({
    view,
    guidanceView,
    assignmentStorage,
    reviewRequestStore,
    sessionState: { isAuthenticated: () => false, getCurrentUser: () => null },
    paperId: 'paper_3',
  });
  controllerUnauth.evaluateReadiness();
});

test('review workflow controller handles start failures', () => {
  const view = { setStatus: jest.fn(), setPaper: jest.fn(), onStartReview: jest.fn((cb) => cb()) };
  const assignmentStorage = { getPaper: () => ({ id: 'paper_1' }), updatePaperStatus: () => { throw new Error('fail'); } };
  const readinessController = { evaluateReadiness: () => ({ ok: true, ready: true }) };
  const controller = createReviewWorkflowController({ view, assignmentStorage, readinessController, paperId: 'paper_1' });
  controller.init();
});

test('reviewer assignments controller covers auth and alert fallback', () => {
  const view = {
    setStatus: jest.fn(),
    setAssignments: jest.fn(),
    onRefresh: jest.fn((cb) => cb()),
    onOpen: jest.fn(),
    setAlert: () => false,
    setAlertFallback: jest.fn(),
  };
  const session = { isAuthenticated: () => true, getCurrentUser: () => ({ email: 'rev@example.com' }) };
  const reviewerAssignments = { listAcceptedAssignments: () => ({ ok: true, assignments: [{ paperId: 'paper_1' }] }) };
  const controller = createReviewerAssignmentsController({
    view,
    sessionState: session,
    reviewerAssignments,
    overassignmentCheck: { evaluate: () => ({ ok: true, overassigned: true, count: 4 }) },
    overassignmentAlert: { build: () => ({ message: 'alert' }) },
  });
  controller.init();

  const controllerFail = createReviewerAssignmentsController({
    view,
    sessionState: session,
    reviewerAssignments: { listAcceptedAssignments: () => ({ ok: false }) },
  });
  controllerFail.refresh();
});

test('reviewer paper controller branches', () => {
  const view = { setStatus: jest.fn(), setPaper: jest.fn() };
  const controllerUnauth = createReviewerPaperController({
    view,
    sessionState: { isAuthenticated: () => false, getCurrentUser: () => null },
    paperId: 'paper_1',
  });
  controllerUnauth.init();

  const controllerNotAccepted = createReviewerPaperController({
    view,
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ email: 'rev@example.com' }) },
    paperId: 'paper_2',
    paperAccess: { getPaperDetails: () => ({ ok: false, reason: 'not_accepted' }) },
  });
  controllerNotAccepted.init();
});

test('review submit controller handles notifications and flags', () => {
  const review = createReview({ reviewId: 'rev_1', paperId: 'paper_1', reviewerId: 'rev', status: 'submitted' });
  const paper = createPaper({ paperId: 'paper_1', editorId: 'editor_1' });
  const controller = createReviewSubmitController({
    review,
    paper,
    notificationsEnabled: true,
    notificationService: { sendReviewNotifications: () => ({ ok: true }) },
    auditLogService: { log: () => {} },
    adminFlagService: { addFlag: () => {} },
    deliveryService: { deliverReview: () => ({ ok: true }) },
  });
  expect(controller.submit().ok).toBe(true);

  const controllerMissing = createReviewSubmitController({
    review,
    paper: createPaper({ paperId: 'paper_2', editorId: null }),
    adminFlagService: { addFlag: jest.fn() },
    auditLogService: { log: () => {} },
  });
  controllerMissing.submit();
});

test('admin notification resend controller resolves flags', () => {
  const flags = { resolveFlag: jest.fn() };
  const controller = createAdminNotificationResendController({
    notificationService: { sendReviewNotifications: () => ({ ok: true }) },
    adminFlagService: flags,
  });
  controller.resend({ reviewId: 'rev', flagId: 'flag_1', editorId: 'editor_1' });
  expect(flags.resolveFlag).toHaveBeenCalled();
});

test('models and services basic coverage', () => {
  expect(createAuditLog({ eventType: 'delivery', relatedId: 'rel' }).relatedId).toBe('rel');
  expect(createDeliveryEvent({ reviewId: 'rev', editorId: 'ed' }).reviewId).toBe('rev');
  expect(createNotification({ reviewId: 'rev', editorId: 'ed' }).reviewId).toBe('rev');
  expect(createReviewDraft({ paperId: 'paper', reviewerEmail: 'rev' }).paperId).toBe('paper');
  expect(createReviewForm({ paperId: 'paper' }).paperId).toBe('paper');
  expect(createValidationError({ fieldKey: 'x', message: 'm' }).message).toBe('m');
  expect(createValidationRuleSet({ requiredFields: ['summary'] }).requiredFields).toHaveLength(1);
  expect(loadValidationRuleSet(null)).toBeNull();
  expect(createNotificationLogEntry({ paperId: 'paper', refereeEmail: 'ref', status: 'sent' }).refereeEmail).toBe('ref');
  expect(isSubmittedReview(createReview({ status: 'submitted' }))).toBe(true);
  expect(isPaperAvailable({ status: 'available' })).toBe(true);
});

test('admin flag and audit log services branches', () => {
  adminFlagService.addFlag({ reviewId: 'rev', reason: 'missing_editor' });
  const flags = adminFlagService.getFlags();
  adminFlagService.resolveFlag(flags[0].flagId);

  auditLogService.log({ eventType: 'delivery', relatedId: 'rev', details: {} });
  auditLogService.setFailureMode(true);
  expect(() => auditLogService.log({ eventType: 'error', relatedId: 'rev' })).toThrow('audit_log_failure');
});

test('notification services branches', () => {
  notificationService.setNotificationsEnabled(false);
  expect(notificationService.sendReviewNotifications({ reviewId: 'rev', editorId: 'ed' }).ok).toBe(false);
  notificationService.setNotificationsEnabled(true);
  notificationService.setReviewFailureMode(true);
  expect(notificationService.sendReviewNotifications({ reviewId: 'rev', editorId: 'ed' }).ok).toBe(false);
  notificationService.setReviewFailureMode(false);
  const sent = notificationService.sendReviewNotifications({ reviewId: 'rev', editorId: 'ed' });
  expect(sent.ok).toBe(true);
  notificationService.setGroupingEnabled(true);
  notificationConfigService.setGroupingEnabled(true);
  expect(notificationConfigService.isGroupingEnabled()).toBe(true);
  expect(notificationService.shouldBatch(Date.now())).toBe(true);
  expect(notificationService.getReviewNotificationsByEditor('ed')).toHaveLength(2);
});

test('delivery and storage services branches', () => {
  expect(reviewDeliveryService.deliverReview({})).toEqual({ ok: false, reason: 'missing_target' });
  reviewDeliveryService.deliverReview({ reviewId: 'rev', editorId: 'ed' });
  expect(reviewDeliveryService.deliverReview({ reviewId: 'rev', editorId: 'ed' }).status).toBe('already_delivered');

  reviewStorageService.setFailureMode(true);
  expect(() => reviewStorageService.saveDraft({ formId: 'form', reviewerEmail: 'rev', content: {} })).toThrow('review_storage_failure');
});

test('validation and draft services branches', () => {
  reviewFormStore.saveForm(createReviewForm({ paperId: 'form_1', requiredFields: ['summary'] }));
  const rules = validationRulesService.getRules({ formId: 'form_1' });
  expect(rules.ok).toBe(true);
  const errorRules = validationRulesService.getRules({ formId: 'missing' });
  expect(errorRules.ok).toBe(false);

  const validation = reviewValidationService.validate({
    content: { summary: 'Ok', recommendation: 'accept', confidenceRating: 2 },
    requiredFields: ['summary'],
    maxLengths: { summary: 1 },
    invalidCharacterPolicy: 'no_control_chars_no_markup',
    action: 'submit_review',
  });
  expect(validation.ok).toBe(false);

  const invalidPolicy = reviewValidationService.validate({
    content: { summary: 'Ok' },
    requiredFields: [],
    invalidCharacterPolicy: 'allow_all',
    action: 'save_draft',
  });
  expect(invalidPolicy.ok).toBe(true);

  const loadResult = reviewDraftLoad.load({
    paperId: 'paper',
    reviewerEmail: 'rev',
    reviewDraftStore: { getDraft: () => { throw new Error('fail'); } },
    errorLog: errorLog,
  });
  expect(loadResult.ok).toBe(false);
});

test('review submission service branches', () => {
  assignmentStore.addAssignment({ paperId: 'paper', reviewerEmail: 'rev@example.com', status: 'accepted' });
  defaultReviewFormStore.saveForm(createReviewForm({ paperId: 'paper', requiredFields: ['summary'] }));
  const status = reviewSubmissionService.getSubmissionStatus({ paperId: 'paper', reviewerEmail: 'rev@example.com' });
  expect(status.status).toBe('draft');

  const validationFail = reviewSubmissionService.submit({ paperId: 'paper', reviewerEmail: 'rev@example.com', content: {} });
  expect(validationFail.reason).toBe('validation_failed');

  assignmentStore.addAssignment({ paperId: 'paper_missing', reviewerEmail: 'rev@example.com', status: 'accepted' });
  const formMissing = reviewSubmissionService.submit({ paperId: 'paper_missing', reviewerEmail: 'rev@example.com', content: { summary: 'Ok' } });
  expect(formMissing.reason).toBe('form_missing');

  reviewSubmissionService.setNotificationFailureMode(true);
  const notifyResult = reviewSubmissionService.submit({
    paperId: 'paper',
    reviewerEmail: 'rev@example.com',
    content: { summary: 'Ok' },
    notificationsEnabled: true,
  });
  expect(notifyResult.notificationStatus).toBe('failed');
});

test('misc services and views branches', () => {
  expect(reviewerBatchAssign.split({ reviewerEmails: ['a@example.com'], currentCount: 0, max: 0 }).blocked).toHaveLength(1);
  reviewerCount.getCountForPaper({ paperId: 'paper', assignmentStore: { getAssignments: () => [{ paperId: 'paper' }] } });
  refereeCount.getCount({ paperId: 'paper', assignmentStorage: { getPaper: () => ({ assignedRefereeEmails: [] }) }, reviewRequestStore: { getRequests: () => [] } });
  overassignmentCheck.evaluate({ paperId: 'paper', reviewerCount: { getCountForPaper: () => { throw new Error('fail'); } }, errorLog });
  readinessAudit.record({ paperId: 'paper', result: 'fail', reason: 'missing' });
  refereeGuidance.getGuidance({ count: 1 });
  refereeInvitationCheck.getMissingInvitations({ paperId: 'paper', reviewRequestStore: { getRequests: () => [] } });
  reviewerPaperAccess.getPaperDetails({ reviewerEmail: 'a', paperId: 'p', assignmentStore: { getAssignments: () => [] }, assignmentStorage: { getPaper: () => null }, submissionStorage: { getManuscripts: () => [] }, errorLog });

  const adminView = createAdminFlagQueueView();
  adminView.setFlags([{ reviewId: 'rev', reason: 'missing' }]);
  adminView.setFlags([{ reviewId: 'rev', reason: 'missing' }], () => {});

  const reviewList = createEditorReviewListView();
  reviewList.setReviews([{ reviewId: 'rev_1' }]);
  const noteView = createEditorNotificationsView();
  noteView.setNotifications([{ reviewId: 'rev_1', status: 'sent' }]);

  const summary = createReviewErrorSummaryView(reviewList.element);
  summary.setErrors([]);
  summary.clear();

  const formView = createReviewFormView();
  reviewFormAccessibility.focusFirstError(formView.element);
  const submissionView = createReviewSubmissionView();
  submissionView.setStatus('Error', true);
  submissionView.setFinalityMessage('Final');

  const validationView = createReviewValidationView();
  reviewValidationAccessibility.focusFirstError(validationView.element);
});
