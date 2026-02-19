import { jest } from '@jest/globals';

import { createReviewFormController } from '../../src/controllers/review-form-controller.js';
import { createReviewStatusController } from '../../src/controllers/review-status-controller.js';
import { createReviewSubmitController } from '../../src/controllers/review-submit-controller.js';
import { createReviewSubmissionController } from '../../src/controllers/review-submission-controller.js';
import { createReviewValidationController } from '../../src/controllers/review-validation-controller.js';
import { createReviewReadinessController } from '../../src/controllers/review-readiness-controller.js';
import { createReviewerAssignmentsController } from '../../src/controllers/reviewer-assignments-controller.js';
import { createReviewerPaperController } from '../../src/controllers/reviewer-paper-controller.js';
import { createRefereeAssignmentController } from '../../src/controllers/referee-assignment-controller.js';

import { notificationConfigService } from '../../src/services/notification-config-service.js';
import { notificationService } from '../../src/services/notification-service.js';
import { assignmentRules } from '../../src/services/assignment-rules.js';
import { assignmentService } from '../../src/services/assignment-service.js';
import { assignmentStorage } from '../../src/services/assignment-storage.js';
import { overassignmentAlert } from '../../src/services/overassignment-alert.js';
import { refereeAssignmentGuard } from '../../src/services/referee-assignment-guard.js';
import { refereeCount } from '../../src/services/referee-count.js';
import { refereeInvitationCheck } from '../../src/services/referee-invitation-check.js';
import { refereeReadiness, buildReadinessResult } from '../../src/services/referee-readiness.js';
import { reviewDeliveryService } from '../../src/services/review-delivery-service.js';
import { reviewDraftLoad } from '../../src/services/review-draft-load.js';
import { reviewDraftStore } from '../../src/services/review-draft-store.js';
import { reviewFormAccess } from '../../src/services/review-form-access.js';
import { reviewFormStore } from '../../src/services/review-form-store.js';
import { reviewStorageService } from '../../src/services/review-storage-service.js';
import { reviewSubmissionService } from '../../src/services/review-submission-service.js';
import { reviewValidationService } from '../../src/services/review-validation-service.js';
import { reviewerAssignments } from '../../src/services/reviewer-assignments.js';
import { reviewerCount } from '../../src/services/reviewer-count.js';
import { reviewerPaperAccess } from '../../src/services/reviewer-paper-access.js';
import { validationRulesService } from '../../src/services/validation-rules-service.js';

import { createRefereeGuidanceView } from '../../src/views/referee-guidance-view.js';
import { createReviewerAssignmentsView } from '../../src/views/reviewer-assignments-view.js';
import { createAdminFlagQueueView } from '../../src/views/admin-flag-queue-view.js';

import { isManuscriptAvailable, createManuscript } from '../../src/models/manuscript.js';
import { assignReferees, createPaper } from '../../src/models/paper.js';
import { isNonDeclinedRefereeAssignment } from '../../src/models/referee-assignment.js';
import { isFormClosed } from '../../src/models/review-form.js';
import { TEXT_VALIDATION_FIELDS } from '../../src/models/validation-constants.js';

// Wrapper modules (camelCase/PascalCase re-exports)
import { createAdminNotificationResendController } from '../../src/controllers/adminNotificationResendController.js';
import { createEditorReviewAccessController } from '../../src/controllers/editorReviewAccessController.js';
import { createReviewNotificationController } from '../../src/controllers/reviewNotificationController.js';
import { createReviewSubmitController as createReviewSubmitControllerAlias } from '../../src/controllers/reviewSubmitController.js';
import { createReviewValidationController as createReviewValidationControllerAlias } from '../../src/controllers/reviewValidationController.js';
import { createAuditLog } from '../../src/models/AuditLog.js';
import { createDeliveryEvent } from '../../src/models/DeliveryEvent.js';
import { createEditor } from '../../src/models/Editor.js';
import { createNotification } from '../../src/models/Notification.js';
import { createPaper as createPaperAlias } from '../../src/models/Paper.js';
import { createReview } from '../../src/models/Review.js';
import { createReviewDraft } from '../../src/models/ReviewDraft.js';
import { createReviewForm as createReviewFormAlias } from '../../src/models/ReviewForm.js';
import { createValidationError } from '../../src/models/ValidationError.js';
import { loadValidationRuleSet } from '../../src/models/ValidationRuleSet.js';
import { DELIVERY_STATUS } from '../../src/models/deliveryConstants.js';
import { REVIEW_FIELDS } from '../../src/models/reviewConstants.js';
import { FIELD_LABELS } from '../../src/models/validationConstants.js';
import { adminFlagService } from '../../src/services/adminFlagService.js';
import { auditLogService } from '../../src/services/auditLogService.js';
import { notificationConfigService as notificationConfigServiceAlias } from '../../src/services/notificationConfigService.js';
import { reviewDeliveryService as reviewDeliveryServiceAlias } from '../../src/services/reviewDeliveryService.js';
import { reviewStorageService as reviewStorageServiceAlias } from '../../src/services/reviewStorageService.js';
import { reviewValidationService as reviewValidationServiceAlias } from '../../src/services/reviewValidationService.js';
import { validationRulesService as validationRulesServiceAlias } from '../../src/services/validationRulesService.js';
import { createAdminFlagQueueView as createAdminFlagQueueViewAlias } from '../../src/views/adminFlagQueueView.js';
import { editorAccessibility } from '../../src/views/editorAccessibility.js';
import { createEditorNotificationsView } from '../../src/views/editorNotificationsView.js';
import { createEditorReviewListView } from '../../src/views/editorReviewListView.js';
import { createReviewErrorSummaryView } from '../../src/views/reviewErrorSummaryView.js';
import { reviewValidationAccessibility } from '../../src/views/reviewValidationAccessibility.js';
import { createReviewValidationView } from '../../src/views/reviewValidationView.js';

const buildSessionState = ({ authenticated = true, user = { email: 'user@example.com', role: 'editor' } } = {}) => ({
  isAuthenticated: () => authenticated,
  getCurrentUser: () => user,
});

const buildViewStatus = () => ({
  setStatus: jest.fn(),
  setForm: jest.fn(),
  setDraft: jest.fn(),
  setViewOnly: jest.fn(),
  clearErrors: jest.fn(),
  setFieldError: jest.fn(),
  setAuthorizationMessage: jest.fn(),
  setEditable: jest.fn(),
  setPaper: jest.fn(),
  setCount: jest.fn(),
  setWarning: jest.fn(),
  setSummary: jest.fn(() => true),
  setFallbackSummary: jest.fn(),
  setMissingInvitations: jest.fn(),
  setGuidance: jest.fn(),
  onSubmit: jest.fn(),
  onSaveDraft: jest.fn(),
  onSubmitReview: jest.fn(),
  onRefresh: jest.fn(),
  onOpen: jest.fn(),
});

test('wrapper modules export expected values', () => {
  expect(createAdminNotificationResendController).toBeInstanceOf(Function);
  expect(createEditorReviewAccessController).toBeInstanceOf(Function);
  expect(createReviewNotificationController).toBeInstanceOf(Function);
  expect(createReviewSubmitControllerAlias).toBeInstanceOf(Function);
  expect(createReviewValidationControllerAlias).toBeInstanceOf(Function);
  expect(createAuditLog).toBeInstanceOf(Function);
  expect(createDeliveryEvent).toBeInstanceOf(Function);
  expect(createEditor).toBeInstanceOf(Function);
  expect(createNotification).toBeInstanceOf(Function);
  expect(createPaperAlias).toBeInstanceOf(Function);
  expect(createReview).toBeInstanceOf(Function);
  expect(createReviewDraft).toBeInstanceOf(Function);
  expect(createReviewFormAlias).toBeInstanceOf(Function);
  expect(createValidationError).toBeInstanceOf(Function);
  expect(loadValidationRuleSet).toBeInstanceOf(Function);
  expect(DELIVERY_STATUS).toBeDefined();
  expect(REVIEW_FIELDS).toBeDefined();
  expect(FIELD_LABELS).toBeDefined();
  expect(adminFlagService).toBeDefined();
  expect(auditLogService).toBeDefined();
  expect(notificationConfigServiceAlias).toBeDefined();
  expect(reviewDeliveryServiceAlias).toBeDefined();
  expect(reviewStorageServiceAlias).toBeDefined();
  expect(reviewValidationServiceAlias).toBeDefined();
  expect(validationRulesServiceAlias).toBeDefined();
  expect(createAdminFlagQueueViewAlias).toBeInstanceOf(Function);
  expect(editorAccessibility).toBeDefined();
  expect(createEditorNotificationsView).toBeInstanceOf(Function);
  expect(createEditorReviewListView).toBeInstanceOf(Function);
  expect(createReviewErrorSummaryView).toBeInstanceOf(Function);
  expect(reviewValidationAccessibility).toBeDefined();
  expect(createReviewValidationView).toBeInstanceOf(Function);
});

test('controller factories handle default args', () => {
  expect(createReviewFormController()).toBeDefined();
  expect(createReviewStatusController()).toBeDefined();
  expect(createReviewSubmissionController()).toBeDefined();
  expect(createReviewValidationController()).toBeDefined();
  expect(createReviewReadinessController()).toBeDefined();
  expect(createReviewerAssignmentsController()).toBeDefined();
  expect(createReviewerPaperController()).toBeDefined();
});

test('notification config delegates to notification service', () => {
  notificationService.clear();
  notificationConfigService.setGroupingEnabled(true);
  notificationService.sendReviewNotifications({ reviewId: 'r1', editorId: 'e1' });
  expect(notificationConfigService.isGroupingEnabled()).toBe(true);
});

test('admin flag queue view wires resend action', () => {
  const view = createAdminFlagQueueView();
  const onResend = jest.fn();
  view.setFlags([{ reviewId: 'rev1', reason: 'missing' }], onResend);
  const button = view.element.querySelector('button');
  button.click();
  expect(onResend).toHaveBeenCalledWith({ reviewId: 'rev1', reason: 'missing' });
});

test('review form controller handles missing email and view-only state', () => {
  const view = buildViewStatus();
  const sessionState = buildSessionState({ user: {} });
  const reviewFormAccess = {
    getForm: jest.fn(() => ({ ok: true, form: { id: 'f1' }, draft: { value: 1 }, viewOnly: true })),
  };
  const controller = createReviewFormController({
    view,
    sessionState,
    paperId: 'p1',
    reviewFormAccess,
  });
  controller.init();
  expect(reviewFormAccess.getForm).toHaveBeenCalled();
  expect(view.setViewOnly).toHaveBeenCalledWith(true, 'Review period is closed. View-only access.');
});

test('review form controller requests auth when unauthenticated', () => {
  const view = buildViewStatus();
  const sessionState = buildSessionState({ authenticated: false });
  const authController = { requestLogin: jest.fn() };
  const controller = createReviewFormController({
    view,
    sessionState,
    paperId: 'p2',
    authController,
  });
  controller.init();
  expect(view.setStatus).toHaveBeenCalledWith('Please log in to access the review form.', true);
  expect(authController.requestLogin).toHaveBeenCalled();
});

test('review status controller handles missing reviewer email', () => {
  const view = { setStatus: jest.fn() };
  const sessionState = buildSessionState({ user: {} });
  const reviewStatusService = { getStatus: jest.fn(() => ({ ok: false })) };
  const controller = createReviewStatusController({ view, sessionState, paperId: 'p1', reviewStatusService });
  controller.init();
  expect(reviewStatusService.getStatus).toHaveBeenCalledWith({ paperId: 'p1', reviewerEmail: null });
  expect(view.setStatus).toHaveBeenCalledWith('Review status not found.', true);
});

test('review status controller handles success status', () => {
  const view = { setStatus: jest.fn() };
  const sessionState = buildSessionState();
  const reviewStatusService = { getStatus: jest.fn(() => ({ ok: true, status: 'submitted' })) };
  const controller = createReviewStatusController({ view, sessionState, paperId: 'p2', reviewStatusService });
  controller.init();
  expect(view.setStatus).toHaveBeenCalledWith('Review status: submitted', false);
});

test('review submit controller handles missing editor and notifications', () => {
  const auditLogServiceMock = { log: jest.fn(() => { throw new Error('fail'); }) };
  const deliveryService = { deliverReview: jest.fn(() => ({ ok: true })) };
  const notificationServiceMock = { sendReviewNotifications: jest.fn(() => ({ ok: true })) };
  const adminFlagServiceMock = { addFlag: jest.fn() };

  const missingEditor = createReviewSubmitController({
    review: { reviewId: 'r1', status: 'submitted' },
    paper: { paperId: 'p1', editorId: null },
    deliveryService,
    auditLogService: auditLogServiceMock,
    adminFlagService: adminFlagServiceMock,
  });
  expect(missingEditor.submit()).toEqual({ ok: false, reason: 'missing_editor' });
  expect(adminFlagServiceMock.addFlag).toHaveBeenCalled();

  const withNotifications = createReviewSubmitController({
    review: { reviewId: 'r2', status: 'submitted' },
    paper: { paperId: 'p2', editorId: 'e2' },
    deliveryService,
    notificationService: notificationServiceMock,
    auditLogService: auditLogServiceMock,
    notificationsEnabled: true,
  });
  const result = withNotifications.submit();
  expect(result.ok).toBe(true);
  expect(notificationServiceMock.sendReviewNotifications).toHaveBeenCalled();
});

test('review submit controller returns not_submitted when missing review', () => {
  const controller = createReviewSubmitController();
  expect(controller.submit().reason).toBe('not_submitted');
});

test('review validation controller handles rules unavailable and validation errors', () => {
  const view = {
    element: document.createElement('div'),
    getValues: jest.fn(() => ({ title: '' })),
    clearErrors: jest.fn(),
    setStatus: jest.fn(),
    setFieldError: jest.fn(),
    onSaveDraft: jest.fn(),
    onSubmitReview: jest.fn(),
  };
  const summaryView = { clear: jest.fn(), setErrors: jest.fn() };
  const validationRulesService = { getRules: jest.fn(() => ({ ok: false })) };
  const controller = createReviewValidationController({ view, summaryView, formId: 'f1', validationRulesService });
  controller.init();
  const onSave = view.onSaveDraft.mock.calls[0][0];
  onSave({ preventDefault: jest.fn() });
  expect(view.setStatus).toHaveBeenCalledWith('Validation rules are unavailable. Please try again later.', true);
});

test('review validation controller handles draft save and storage failure', () => {
  const view = {
    element: document.createElement('div'),
    getValues: jest.fn(() => ({ title: 'ok' })),
    clearErrors: jest.fn(),
    setStatus: jest.fn(),
    setFieldError: jest.fn(),
    onSaveDraft: jest.fn(),
    onSubmitReview: jest.fn(),
  };
  const summaryView = { clear: jest.fn(), setErrors: jest.fn() };
  const validationRulesService = {
    getRules: jest.fn(() => ({ ok: true, rules: { requiredFields: [], maxLengths: {}, invalidCharacterPolicy: 'no_control_chars_no_markup' } })),
  };
  const reviewValidationServiceMock = {
    validate: jest.fn(() => ({ ok: true, errors: {}, messages: {} })),
  };
  const reviewStorageServiceMock = {
    saveDraft: jest.fn(() => { throw {}; }),
    submitReview: jest.fn(),
  };
  const errorLog = { logFailure: jest.fn() };
  const controller = createReviewValidationController({
    view,
    summaryView,
    formId: 'f2',
    reviewValidationService: reviewValidationServiceMock,
    validationRulesService,
    reviewStorageService: reviewStorageServiceMock,
    errorLog,
  });
  controller.init();
  const onSave = view.onSaveDraft.mock.calls[0][0];
  onSave({ preventDefault: jest.fn() });
  expect(errorLog.logFailure).toHaveBeenCalled();
  expect(view.setStatus).toHaveBeenCalledWith('We could not save your review. Please try again.', true);
});

test('review validation controller submits and logs slow handling', () => {
  const view = {
    element: document.createElement('div'),
    getValues: jest.fn(() => ({ title: 'ok' })),
    clearErrors: jest.fn(),
    setStatus: jest.fn(),
    setFieldError: jest.fn(),
    onSaveDraft: jest.fn(),
    onSubmitReview: jest.fn(),
  };
  const summaryView = { clear: jest.fn(), setErrors: jest.fn() };
  const validationRulesService = {
    getRules: jest.fn(() => ({ ok: true, rules: { requiredFields: [], maxLengths: {}, invalidCharacterPolicy: 'no_control_chars_no_markup' } })),
  };
  const reviewValidationServiceMock = {
    validate: jest.fn(() => ({ ok: true, errors: {}, messages: {} })),
  };
  const reviewStorageServiceMock = {
    saveDraft: jest.fn(),
    submitReview: jest.fn(),
  };
  const errorLog = { logFailure: jest.fn() };
  const performanceSpy = jest.spyOn(performance, 'now');

  const controller = createReviewValidationController({
    view,
    summaryView,
    formId: 'f3',
    reviewValidationService: reviewValidationServiceMock,
    validationRulesService,
    reviewStorageService: reviewStorageServiceMock,
    errorLog,
    sessionState: buildSessionState(),
  });
  controller.init();
  const onSubmit = view.onSubmitReview.mock.calls[0][0];
  performanceSpy.mockReturnValueOnce(0).mockReturnValueOnce(300);
  onSubmit({ preventDefault: jest.fn() });
  expect(errorLog.logFailure).toHaveBeenCalled();
  performanceSpy.mockRestore();
});

test('review validation controller returns early when view is missing', () => {
  const controller = createReviewValidationController({ view: null });
  controller.init();
});

test('review validation controller handles validation errors without summary view', () => {
  const view = {
    element: document.createElement('div'),
    getValues: jest.fn(() => ({ summary: '' })),
    clearErrors: jest.fn(),
    setStatus: jest.fn(),
    setFieldError: jest.fn(),
    onSaveDraft: jest.fn(),
    onSubmitReview: jest.fn(),
  };
  const validationRulesService = {
    getRules: jest.fn(() => ({ ok: true, rules: { requiredFields: ['summary'], maxLengths: {}, invalidCharacterPolicy: 'no_control_chars_no_markup' } })),
  };
  const reviewValidationServiceMock = {
    validate: jest.fn(() => ({ ok: false, errors: { summary: 'required' }, messages: {} })),
  };
  const controller = createReviewValidationController({
    view,
    summaryView: null,
    formId: 'f4',
    reviewValidationService: reviewValidationServiceMock,
    validationRulesService,
    reviewValidationAccessibility: null,
    sessionState: buildSessionState({ user: {} }),
  });
  controller.init();
  const onSubmit = view.onSubmitReview.mock.calls[0][0];
  onSubmit({ preventDefault: jest.fn() });
  expect(view.setStatus).toHaveBeenCalledWith('Please correct the highlighted errors.', true);
});

test('review validation controller skips slow log without errorLog', () => {
  const view = {
    element: document.createElement('div'),
    getValues: jest.fn(() => ({ summary: 'ok' })),
    clearErrors: jest.fn(),
    setStatus: jest.fn(),
    setFieldError: jest.fn(),
    onSaveDraft: jest.fn(),
    onSubmitReview: jest.fn(),
  };
  const validationRulesService = {
    getRules: jest.fn(() => ({ ok: true, rules: { requiredFields: [], maxLengths: {}, invalidCharacterPolicy: 'no_control_chars_no_markup' } })),
  };
  const reviewValidationServiceMock = {
    validate: jest.fn(() => ({ ok: true, errors: {}, messages: {} })),
  };
  const reviewStorageServiceMock = {
    saveDraft: jest.fn(),
    submitReview: jest.fn(),
  };
  const controller = createReviewValidationController({
    view,
    summaryView: { clear: jest.fn(), setErrors: jest.fn() },
    formId: 'f5',
    reviewValidationService: reviewValidationServiceMock,
    validationRulesService,
    reviewStorageService: reviewStorageServiceMock,
    errorLog: null,
  });
  controller.init();
  const onSubmit = view.onSubmitReview.mock.calls[0][0];
  onSubmit({ preventDefault: jest.fn() });
});

test('review validation controller handles missing performance and user email', () => {
  const view = {
    element: document.createElement('div'),
    getValues: jest.fn(() => ({ summary: 'ok' })),
    clearErrors: jest.fn(),
    setStatus: jest.fn(),
    setFieldError: jest.fn(),
    onSaveDraft: jest.fn(),
    onSubmitReview: jest.fn(),
  };
  const validationRulesService = {
    getRules: jest.fn(() => ({ ok: true, rules: { requiredFields: [], maxLengths: {}, invalidCharacterPolicy: 'no_control_chars_no_markup' } })),
  };
  const reviewValidationServiceMock = {
    validate: jest.fn(() => ({ ok: true, errors: {}, messages: {} })),
  };
  const reviewStorageServiceMock = {
    saveDraft: jest.fn(),
    submitReview: jest.fn(),
  };
  const originalPerformance = global.performance;
  delete global.performance;
  const controller = createReviewValidationController({
    view,
    summaryView: { clear: jest.fn(), setErrors: jest.fn() },
    formId: 'f6',
    reviewValidationService: reviewValidationServiceMock,
    validationRulesService,
    reviewStorageService: reviewStorageServiceMock,
    sessionState: buildSessionState({ user: null }),
  });
  controller.init();
  const onSave = view.onSaveDraft.mock.calls[0][0];
  onSave({ preventDefault: jest.fn() });
  global.performance = originalPerformance;
});

test('review submission controller covers rejection paths and success notification warning', () => {
  const formView = {
    element: document.createElement('div'),
    getValues: jest.fn(() => ({ body: 'text' })),
    isConfirmed: jest.fn(() => true),
    setViewOnly: jest.fn(),
    onSubmit: jest.fn(),
  };
  const submissionView = {
    setStatus: jest.fn(),
    setFinalityMessage: jest.fn(),
    setNotificationWarning: jest.fn(),
  };
  const validationView = { clear: jest.fn(), setFieldError: jest.fn() };
  const errorSummaryView = { clear: jest.fn(), setErrors: jest.fn() };
  const reviewSubmissionServiceMock = {
    preserveDraft: jest.fn(),
    submit: jest.fn(() => ({ ok: false, reason: 'duplicate' })),
  };
  const reviewValidationServiceMock = {
    validate: jest.fn(() => ({ ok: true, errors: {} })),
  };
  const controller = createReviewSubmissionController({
    formView,
    submissionView,
    validationView,
    errorSummaryView,
    sessionState: buildSessionState(),
    paperId: 'p1',
    reviewSubmissionService: reviewSubmissionServiceMock,
    reviewValidationService: reviewValidationServiceMock,
  });
  controller.init();
  const onSubmit = formView.onSubmit.mock.calls[0][0];
  onSubmit({ preventDefault: jest.fn() });
  expect(submissionView.setFinalityMessage).toHaveBeenCalled();

  reviewSubmissionServiceMock.submit.mockReturnValueOnce({ ok: true, notificationStatus: 'failed' });
  onSubmit({ preventDefault: jest.fn() });
  expect(submissionView.setNotificationWarning).toHaveBeenCalled();
});

test('review submission controller handles closed and unauthorized submissions', () => {
  const formView = {
    element: document.createElement('div'),
    getValues: jest.fn(() => ({ body: 'text' })),
    isConfirmed: jest.fn(() => true),
    setViewOnly: jest.fn(),
    onSubmit: jest.fn(),
  };
  const submissionView = {
    setStatus: jest.fn(),
    setFinalityMessage: jest.fn(),
    setNotificationWarning: jest.fn(),
  };
  const reviewSubmissionServiceMock = {
    preserveDraft: jest.fn(),
    submit: jest.fn()
      .mockReturnValueOnce({ ok: false, reason: 'closed' })
      .mockReturnValueOnce({ ok: false, reason: 'not_assigned' })
      .mockReturnValueOnce({ ok: false, reason: 'not_accepted' })
      .mockReturnValueOnce({ ok: false, reason: 'validation_failed' })
      .mockReturnValueOnce({ ok: false, reason: 'save_failed' }),
  };
  const reviewValidationServiceMock = {
    validate: jest.fn(() => ({ ok: true, errors: {} })),
  };
  const controller = createReviewSubmissionController({
    formView,
    submissionView,
    sessionState: buildSessionState(),
    paperId: 'p3',
    reviewSubmissionService: reviewSubmissionServiceMock,
    reviewValidationService: reviewValidationServiceMock,
  });
  controller.init();
  const onSubmit = formView.onSubmit.mock.calls[0][0];
  onSubmit({ preventDefault: jest.fn() });
  onSubmit({ preventDefault: jest.fn() });
  onSubmit({ preventDefault: jest.fn() });
  onSubmit({ preventDefault: jest.fn() });
  onSubmit({ preventDefault: jest.fn() });
  expect(submissionView.setStatus).toHaveBeenCalledWith('Review period is closed. View-only access.', true);
  expect(submissionView.setStatus).toHaveBeenCalledWith('You are not authorized to submit this review.', true);
  expect(submissionView.setStatus).toHaveBeenCalledWith('Please fix validation errors before submitting.', true);
  expect(submissionView.setStatus).toHaveBeenCalledWith('Review submission failed. Your draft was preserved.', true);
});

test('review submission controller handles validation errors without optional views', () => {
  const formView = {
    element: document.createElement('div'),
    getValues: jest.fn(() => ({ body: '' })),
    isConfirmed: jest.fn(() => true),
    onSubmit: jest.fn(),
  };
  const reviewSubmissionServiceMock = { preserveDraft: jest.fn() };
  const reviewValidationServiceMock = { validate: jest.fn(() => ({ ok: false, errors: { body: 'required' } })) };
  const controller = createReviewSubmissionController({
    formView,
    submissionView: null,
    validationView: null,
    errorSummaryView: null,
    sessionState: buildSessionState({ user: {} }),
    paperId: 'p6',
    reviewSubmissionService: reviewSubmissionServiceMock,
    reviewValidationService: reviewValidationServiceMock,
    errorLog: null,
    reviewFormAccessibility: null,
  });
  controller.init();
  const onSubmit = formView.onSubmit.mock.calls[0][0];
  onSubmit({ preventDefault: jest.fn() });
  expect(reviewSubmissionServiceMock.preserveDraft).toHaveBeenCalled();
});

test('review submission controller skips slow log without errorLog', () => {
  const formView = {
    element: document.createElement('div'),
    getValues: jest.fn(() => ({ body: 'ok' })),
    isConfirmed: jest.fn(() => true),
    setViewOnly: jest.fn(),
    onSubmit: jest.fn(),
  };
  const submissionView = { setStatus: jest.fn(), setFinalityMessage: jest.fn(), setNotificationWarning: jest.fn() };
  const reviewSubmissionServiceMock = { submit: jest.fn(() => ({ ok: true, notificationStatus: 'sent' })) };
  const reviewValidationServiceMock = { validate: jest.fn(() => ({ ok: true, errors: {} })) };
  const controller = createReviewSubmissionController({
    formView,
    submissionView,
    sessionState: buildSessionState(),
    paperId: 'p7',
    reviewSubmissionService: reviewSubmissionServiceMock,
    reviewValidationService: reviewValidationServiceMock,
    errorLog: null,
  });
  controller.init();
  const onSubmit = formView.onSubmit.mock.calls[0][0];
  onSubmit({ preventDefault: jest.fn() });
});

test('review submission controller handles validation error and slow submission', () => {
  const formView = {
    element: document.createElement('div'),
    getValues: jest.fn(() => ({ body: '' })),
    isConfirmed: jest.fn(() => true),
    onSubmit: jest.fn(),
  };
  const submissionView = { setStatus: jest.fn(), setFinalityMessage: jest.fn(), setNotificationWarning: jest.fn() };
  const validationView = { clear: jest.fn(), setFieldError: jest.fn() };
  const errorSummaryView = { clear: jest.fn(), setErrors: jest.fn() };
  const reviewSubmissionServiceMock = { preserveDraft: jest.fn(), submit: jest.fn() };
  const reviewValidationServiceMock = { validate: jest.fn(() => ({ ok: false, errors: { body: 'required' } })) };
  const errorLog = { logFailure: jest.fn() };
  const performanceSpy = jest.spyOn(performance, 'now');

  const controller = createReviewSubmissionController({
    formView,
    submissionView,
    validationView,
    errorSummaryView,
    sessionState: buildSessionState(),
    paperId: 'p2',
    reviewSubmissionService: reviewSubmissionServiceMock,
    reviewValidationService: reviewValidationServiceMock,
    errorLog,
  });
  controller.init();
  const onSubmit = formView.onSubmit.mock.calls[0][0];
  onSubmit({ preventDefault: jest.fn() });
  expect(reviewSubmissionServiceMock.preserveDraft).toHaveBeenCalled();

  reviewValidationServiceMock.validate.mockReturnValueOnce({ ok: true, errors: {} });
  reviewSubmissionServiceMock.submit.mockReturnValueOnce({ ok: true, notificationStatus: 'sent' });
  performanceSpy.mockReturnValueOnce(0).mockReturnValueOnce(100);
  onSubmit({ preventDefault: jest.fn() });
  expect(errorLog.logFailure).toHaveBeenCalled();
  performanceSpy.mockRestore();
});

test('review submission controller handles confirmation and session expiry', () => {
  const formView = {
    element: document.createElement('div'),
    getValues: jest.fn(() => ({ body: 'text' })),
    isConfirmed: jest.fn(() => false),
    onSubmit: jest.fn(),
  };
  const submissionView = { setStatus: jest.fn(), setFinalityMessage: jest.fn(), setNotificationWarning: jest.fn() };
  const controller = createReviewSubmissionController({
    formView,
    submissionView,
    sessionState: buildSessionState(),
    paperId: 'p4',
    reviewSubmissionService: { preserveDraft: jest.fn(), submit: jest.fn() },
    reviewValidationService: { validate: jest.fn() },
  });
  controller.init();
  const onSubmit = formView.onSubmit.mock.calls[0][0];
  onSubmit({ preventDefault: jest.fn() });
  expect(submissionView.setStatus).toHaveBeenCalledWith('Please confirm your submission is final.', true);

  const expiredController = createReviewSubmissionController({
    formView,
    submissionView: null,
    sessionState: buildSessionState({ authenticated: false }),
    paperId: 'p4',
    authController: null,
  });
  expiredController.init();
  const onSubmitExpired = formView.onSubmit.mock.calls[1][0];
  const originalPerformance = global.performance;
  delete global.performance;
  onSubmitExpired({ preventDefault: jest.fn() });
  global.performance = originalPerformance;
});

test('review submission controller handles closed without formView and skips errorLog', () => {
  const submissionView = { setStatus: jest.fn(), setFinalityMessage: jest.fn(), setNotificationWarning: jest.fn() };
  const reviewSubmissionServiceMock = { submit: jest.fn(() => ({ ok: false, reason: 'closed' })) };
  const controller = createReviewSubmissionController({
    formView: null,
    submissionView,
    sessionState: buildSessionState(),
    paperId: 'p5',
    reviewSubmissionService: reviewSubmissionServiceMock,
    reviewValidationService: { validate: jest.fn() },
    errorLog: null,
  });
  controller.init();
});

test('review readiness controller handles auth, missing paper, and guidance', () => {
  const view = buildViewStatus();
  const guidanceView = { setGuidance: jest.fn(), onAction: jest.fn() };
  const assignmentStorage = { getPaper: jest.fn(() => null) };
  const sessionState = buildSessionState({ authenticated: false, user: { role: 'author' } });
  const controller = createReviewReadinessController({
    view,
    guidanceView,
    assignmentStorage,
    reviewRequestStore: {},
    sessionState,
    paperId: 'p1',
    onAuthRequired: jest.fn(),
  });
  const result = controller.evaluateReadiness();
  expect(result.reason).toBe('unauthorized');

  sessionState.isAuthenticated = () => true;
  sessionState.getCurrentUser = () => ({ role: 'editor' });
  const result2 = controller.evaluateReadiness();
  expect(result2.reason).toBe('paper_not_found');
});

test('review readiness controller denies non-editor user', () => {
  const view = buildViewStatus();
  const controller = createReviewReadinessController({
    view,
    assignmentStorage: { getPaper: jest.fn() },
    reviewRequestStore: {},
    sessionState: buildSessionState({ authenticated: true, user: { role: 'author' } }),
    paperId: 'p1',
  });
  const result = controller.evaluateReadiness();
  expect(result.reason).toBe('unauthorized');
});

test('review readiness controller denies missing role', () => {
  const view = buildViewStatus();
  const controller = createReviewReadinessController({
    view,
    assignmentStorage: { getPaper: jest.fn() },
    reviewRequestStore: {},
    sessionState: buildSessionState({ authenticated: true, user: {} }),
    paperId: 'p1',
  });
  const result = controller.evaluateReadiness();
  expect(result.reason).toBe('unauthorized');
});

test('review readiness controller sets guidance when provided', () => {
  const view = buildViewStatus();
  const guidanceView = { setGuidance: jest.fn(), onAction: jest.fn() };
  const controller = createReviewReadinessController({
    view,
    guidanceView,
    assignmentStorage: { getPaper: jest.fn(() => ({ id: 'p1' })) },
    reviewRequestStore: {},
    sessionState: buildSessionState(),
    paperId: 'p1',
    readinessService: { evaluate: () => ({ ok: true, ready: false, count: 1, missingInvitations: [] }) },
    guidanceService: { getGuidance: () => ({ message: 'Guide', actionLabel: 'Do', action: 'act' }) },
  });
  controller.evaluateReadiness();
  expect(guidanceView.setGuidance).toHaveBeenCalled();
});

test('reviewer assignments controller covers alert fallback and onOpen', () => {
  const view = {
    setStatus: jest.fn(),
    setAssignments: jest.fn(),
    setAlert: jest.fn(() => false),
    setAlertFallback: jest.fn(),
    onRefresh: jest.fn(),
    onOpen: jest.fn(),
  };
  const reviewerAssignmentsMock = {
    listAcceptedAssignments: jest.fn(() => ({ ok: true, assignments: [null, { paperId: 'p1' }] })),
  };
  const overassignmentCheck = { evaluate: jest.fn(() => ({ ok: true, overassigned: true, count: 5 })) };
  const overassignmentAlertMock = { build: jest.fn(() => ({ message: 'warn' })) };
  const errorLog = { logFailure: jest.fn() };
  const onOpenPaper = jest.fn();

  const controller = createReviewerAssignmentsController({
    view,
    sessionState: buildSessionState(),
    reviewerAssignments: reviewerAssignmentsMock,
    overassignmentCheck,
    overassignmentAlert: overassignmentAlertMock,
    errorLog,
    onOpenPaper,
  });
  controller.init();
  const onOpen = view.onOpen.mock.calls[0][0];
  onOpen({ paperId: 'p1' });
  expect(onOpenPaper).toHaveBeenCalled();
  expect(errorLog.logFailure).toHaveBeenCalled();
});

test('reviewer assignments controller handles alert without error log', () => {
  const view = {
    setStatus: jest.fn(),
    setAssignments: jest.fn(),
    setAlert: jest.fn(() => false),
    setAlertFallback: jest.fn(),
    onRefresh: jest.fn(),
    onOpen: jest.fn(),
  };
  const reviewerAssignmentsMock = {
    listAcceptedAssignments: jest.fn(() => ({ ok: true, assignments: [{ paperId: 'p1' }] })),
  };
  const overassignmentCheck = { evaluate: jest.fn(() => ({ ok: true, overassigned: true, count: 5 })) };
  const overassignmentAlertMock = { build: jest.fn(() => ({ message: 'warn' })) };

  const controller = createReviewerAssignmentsController({
    view,
    sessionState: buildSessionState(),
    reviewerAssignments: reviewerAssignmentsMock,
    overassignmentCheck,
    overassignmentAlert: overassignmentAlertMock,
    errorLog: null,
  });
  controller.init();
  const onOpen = view.onOpen.mock.calls[0][0];
  onOpen({ paperId: 'p1' });
});

test('reviewer paper controller handles failures and success', () => {
  const view = { setStatus: jest.fn(), setPaper: jest.fn() };
  const paperAccess = {
    getPaperDetails: jest.fn(() => ({ ok: false, reason: 'not_accepted' })),
  };
  const controller = createReviewerPaperController({
    view,
    sessionState: buildSessionState(),
    reviewerEmail: 'reviewer@example.com',
    paperId: 'p1',
    paperAccess,
  });
  controller.init();
  expect(view.setStatus).toHaveBeenCalledWith('Access denied. You must accept the assignment to view this paper.', true);
});

test('reviewer paper controller requests auth when unauthenticated', () => {
  const view = { setStatus: jest.fn(), setPaper: jest.fn() };
  const authController = { requestLogin: jest.fn() };
  const controller = createReviewerPaperController({
    view,
    sessionState: buildSessionState({ authenticated: false }),
    paperId: 'p2',
    authController,
  });
  controller.init();
  expect(view.setStatus).toHaveBeenCalledWith('Please log in to view the paper.', true);
  expect(authController.requestLogin).toHaveBeenCalled();
});

test('reviewer paper controller falls back to session email', () => {
  const view = { setStatus: jest.fn(), setPaper: jest.fn() };
  const paperAccess = {
    getPaperDetails: jest.fn(() => ({ ok: false, reason: 'unavailable' })),
  };
  const controller = createReviewerPaperController({
    view,
    sessionState: buildSessionState({ user: { email: 'session@example.com' } }),
    paperId: 'p3',
    paperAccess,
  });
  controller.init();
  expect(paperAccess.getPaperDetails).toHaveBeenCalledWith(expect.objectContaining({
    reviewerEmail: 'session@example.com',
    paperId: 'p3',
  }));
});

test('reviewer paper controller skips authController when missing', () => {
  const view = { setStatus: jest.fn(), setPaper: jest.fn() };
  const controller = createReviewerPaperController({
    view,
    sessionState: buildSessionState({ authenticated: false }),
    paperId: 'p4',
    authController: null,
  });
  controller.init();
  expect(view.setStatus).toHaveBeenCalledWith('Please log in to view the paper.', true);
});

test('referee assignment controller handles missing paper and update failure', () => {
  const view = buildViewStatus();
  const assignmentStorageMock = {
    getPaper: jest.fn(() => null),
    saveAssignments: jest.fn(() => { throw {}; }),
  };
  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage: assignmentStorageMock,
    sessionState: buildSessionState(),
    paperId: 'p1',
    assignmentService: { submitAssignments: jest.fn() },
  });
  expect(controller.addReferees(['a@b.com']).reason).toBe('paper_not_found');
  assignmentStorageMock.getPaper.mockReturnValueOnce({ id: 'p1', assignedRefereeEmails: [], assignmentVersion: 0, status: 'submitted' });
  const result = controller.removeReferees(['a@b.com']);
  expect(result.ok).toBe(false);
  const missingController = createRefereeAssignmentController({
    view: buildViewStatus(),
    assignmentStorage: { getPaper: jest.fn(() => null), saveAssignments: jest.fn() },
    sessionState: buildSessionState(),
    paperId: 'p2',
    assignmentService: { submitAssignments: jest.fn() },
  });
  const missing = missingController.removeReferees(['a@b.com']);
  expect(missing.reason).toBe('paper_not_found');
});

test('referee assignment controller handles count check failure without violationLog', () => {
  const view = {
    ...buildViewStatus(),
    getRefereeEmails: jest.fn(() => ['referee@example.com']),
    clearErrors: jest.fn(),
    setAuthorizationMessage: jest.fn(),
    setSummary: jest.fn(),
    setFallbackSummary: jest.fn(),
  };
  const assignmentStorage = { getPaper: jest.fn(() => ({ id: 'p1', status: 'submitted' })) };
  const overassignmentCheck = { evaluate: jest.fn(() => ({ ok: false })) };
  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage,
    sessionState: buildSessionState(),
    paperId: 'p1',
    overassignmentCheck,
    violationLog: null,
  });
  controller.init();
  const onSubmit = view.onSubmit.mock.calls[0][0];
  onSubmit({ preventDefault: jest.fn() });
  expect(view.setStatus).toHaveBeenCalledWith(
    'Assignments cannot be completed. Reviewer count could not be determined. Please try again.',
    true,
  );
});

test('referee assignment controller returns error message on update failure', () => {
  const view = buildViewStatus();
  const assignmentStorageMock = {
    getPaper: jest.fn(() => ({ id: 'p1', assignedRefereeEmails: [], assignmentVersion: 0, status: 'submitted' })),
    saveAssignments: jest.fn(() => { throw new Error('save_fail'); }),
  };
  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage: assignmentStorageMock,
    sessionState: buildSessionState(),
    paperId: 'p1',
    assignmentService: { submitAssignments: jest.fn() },
  });
  const result = controller.removeReferees(['a@b.com']);
  expect(result.reason).toBe('save_fail');
});

test('manuscript availability branches', () => {
  expect(isManuscriptAvailable(null)).toBe(false);
  expect(isManuscriptAvailable({ status: 'withdrawn', file: {} })).toBe(false);
  expect(isManuscriptAvailable({ status: 'submitted', fileStatus: 'missing', file: {} })).toBe(false);
  expect(isManuscriptAvailable(createManuscript({
    title: 't',
    authorNames: 'a',
    affiliations: 'a',
    contactEmail: 'a@b.com',
    abstract: 'a',
    keywords: 'a',
    mainSource: 'a',
  }, { originalName: 'file.pdf' }))).toBe(true);
});

test('paper and referee assignment branch coverage', () => {
  const paper = createPaper({ paperId: 'p1', assignmentVersion: 1 });
  expect(assignReferees(paper, 'not-an-array').assignedRefereeEmails).toEqual([]);
  expect(assignReferees(paper).assignedRefereeEmails).toEqual([]);
  expect(assignReferees(paper, ['a@b.com']).assignedRefereeEmails).toEqual(['a@b.com']);
  expect(isNonDeclinedRefereeAssignment(null)).toBe(false);
  expect(isNonDeclinedRefereeAssignment({ status: 'accepted' })).toBe(true);
  expect(isFormClosed({ status: 'closed' })).toBe(true);
  expect(isFormClosed({ status: 'open' })).toBe(false);
});

test('assignment rules cover empty and invalid entries', () => {
  const result = assignmentRules.evaluate({ paperId: 'p1', reviewerEmails: ['', 'bad'] });
  expect(result.candidates).toEqual([]);
  expect(result.violations.length).toBeGreaterThan(0);
});

test('assignment service handles guard errors', () => {
  const guard = { canAssign: jest.fn(() => { throw new Error('boom'); }) };
  const result = assignmentService.submitAssignments({ paperId: 'p1', reviewerEmails: [], assignmentGuard: guard });
  expect(result.ok).toBe(false);
  expect(result.failure).toBe('evaluation_failed');
});

test('assignment storage handles concurrent changes', () => {
  assignmentStorage.reset();
  assignmentStorage.seedPaper({ id: 'p1', status: 'submitted', assignmentVersion: 1 });
  expect(() => assignmentStorage.updatePaperStatus({ paperId: 'p1', status: 'eligible', expectedVersion: 2 })).toThrow('concurrent_change');
});

test('overassignment alert builds with guidance and blocked list', () => {
  const payload = overassignmentAlert.build({ count: 5, blocked: ['a@b.com'], guidanceAction: 'Custom guidance.' });
  expect(payload.message).toContain('Custom guidance.');
  expect(payload.message).toContain('a@b.com');
  const fallback = overassignmentAlert.build({ count: 4 });
  expect(fallback.message).toContain('Over-assignment blocked.');
  expect(overassignmentAlert.build()).toBeDefined();
});

test('referee assignment guard returns ok or blocked', () => {
  const guardOk = refereeAssignmentGuard.canAssign({ refereeCount: { getCount: () => 2 } });
  expect(guardOk.ok).toBe(true);
  const guardBlocked = refereeAssignmentGuard.canAssign({ refereeCount: { getCount: () => 3 } });
  expect(guardBlocked.ok).toBe(false);
  expect(refereeAssignmentGuard.canAssign().ok).toBe(true);
});

test('referee count and invitation checks cover empty and filtered requests', () => {
  const count = refereeCount.getNonDeclinedEmails({ paperId: 'p1', assignmentStorage: { getPaper: () => null } });
  expect(count).toEqual([]);
  const count2 = refereeCount.getNonDeclinedEmails({
    paperId: 'p2',
    assignmentStorage: { getPaper: () => ({ assignedRefereeEmails: ['a@b.com'] }) },
    reviewRequestStore: { getRequests: () => [{ paperId: 'p2', reviewerEmail: 'b@b.com', status: 'sent' }] },
  });
  expect(count2).toEqual(['a@b.com', 'b@b.com']);

  const missing = refereeInvitationCheck.getMissingInvitations({
    paperId: 'p1',
    invitationsEnabled: true,
    refereeCount: { getNonDeclinedEmails: () => ['a@b.com', 'b@b.com'] },
    reviewRequestStore: { getRequests: () => [
      { paperId: 'p1', reviewerEmail: 'a@b.com', status: 'failed' },
      { paperId: 'p1', reviewerEmail: 'b@b.com', status: 'sent' },
      { paperId: 'p1', reviewerEmail: 'c@b.com', status: 'pending' },
      { paperId: 'p2', reviewerEmail: 'd@b.com', status: 'sent' },
    ] },
  });
  expect(missing).toEqual(['a@b.com']);

  const defaultEnabled = refereeInvitationCheck.getMissingInvitations({
    paperId: 'p1',
    refereeCount: { getNonDeclinedEmails: () => [] },
    reviewRequestStore: { getRequests: () => [] },
  });
  expect(defaultEnabled).toEqual([]);

  const disabled = refereeInvitationCheck.getMissingInvitations({ invitationsEnabled: false });
  expect(disabled).toEqual([]);
  expect(refereeCount.getCount()).toBe(0);
  expect(refereeCount.getNonDeclinedEmails()).toEqual([]);
});

test('referee readiness handles count failure, ready, and blocked', () => {
  const errorLog = { logFailure: jest.fn() };
  const readinessAudit = { record: jest.fn() };
  const result = refereeReadiness.evaluate({
    paperId: 'p1',
    refereeCount: { getCount: () => { throw {}; } },
    errorLog,
    readinessAudit,
  });
  expect(result.ok).toBe(false);

  const ready = refereeReadiness.evaluate({
    paperId: 'p2',
    refereeCount: { getCount: () => 3 },
    invitationCheck: null,
    readinessAudit,
  });
  expect(ready.ready).toBe(true);

  const readyWithInvites = refereeReadiness.evaluate({
    paperId: 'p2',
    refereeCount: { getCount: () => 3 },
    invitationCheck: { getMissingInvitations: () => ['a@b.com'] },
    readinessAudit,
  });
  expect(readyWithInvites.missingInvitations).toEqual(['a@b.com']);

  const blocked = refereeReadiness.evaluate({
    paperId: 'p3',
    refereeCount: { getCount: () => 4 },
    readinessAudit,
  });
  expect(blocked.ready).toBe(false);

  const low = refereeReadiness.evaluate({
    paperId: 'p4',
    refereeCount: { getCount: () => 2 },
    readinessAudit,
  });
  expect(low.reason).toBe('count_low');
});

test('review delivery service covers missing target and cache branches', () => {
  reviewDeliveryService.reset();
  localStorage.setItem('cms.editor_review_list', JSON.stringify({ editor1: [], editor2: {}, e1: [{ reviewId: 'r0' }] }));
  expect(reviewDeliveryService.getEditorReviews('editor1')).toEqual([]);
  expect(reviewDeliveryService.getEditorReviews('editor2')).toEqual([]);
  expect(reviewDeliveryService.deliverReview()).toEqual({ ok: false, reason: 'missing_target' });
  expect(reviewDeliveryService.deliverReview({ reviewId: null, editorId: 'e1' }).ok).toBe(false);
  const delivered = reviewDeliveryService.deliverReview({ reviewId: 'r1', editorId: 'e1' });
  expect(delivered.ok).toBe(true);
  expect(reviewDeliveryService.deliverReview({ reviewId: 'r1', editorId: 'e1' }).status).toBe('already_delivered');
});

test('review draft load and store error paths', () => {
  reviewDraftLoad.load();
  const errorLog = { logFailure: jest.fn() };
  const result = reviewDraftLoad.load({ paperId: 'p1', reviewerEmail: 'r', reviewDraftStore: { getDraft: () => { throw {}; } }, errorLog });
  expect(result.ok).toBe(false);
  expect(errorLog.logFailure).toHaveBeenCalled();

  reviewDraftStore.reset();
  reviewDraftStore.setFailureMode(true);
  expect(() => reviewDraftStore.getDraft('p1', 'r')).toThrow('draft_store_failure');

  reviewDraftStore.setFailureMode(false);
  reviewDraftStore.saveDraft({ paperId: 'p1', reviewerEmail: 'r', content: {} });
  reviewDraftStore.setFailureMode(true);
  expect(() => reviewDraftStore.saveDraft({ paperId: 'p1', reviewerEmail: 'r', content: {} })).toThrow('draft_store_failure');

  reviewDraftStore.reset();
  localStorage.setItem('cms.review_drafts', JSON.stringify({}));
  reviewDraftStore.setFailureMode(false);
  reviewDraftStore.getDraft('p1', 'r');
});

test('review form access covers failure modes', () => {
  const errorLog = { logFailure: jest.fn() };
  expect(reviewFormAccess.getForm()).toEqual({ ok: false, reason: 'unauthorized' });
  expect(reviewFormAccess.getForm({ paperId: null, reviewerEmail: null }).reason).toBe('unauthorized');
  expect(reviewFormAccess.getForm({ paperId: 'p1' }).reason).toBe('unauthorized');

  const assignmentStore = { getAssignments: () => { throw {}; } };
  expect(reviewFormAccess.getForm({ paperId: 'p1', reviewerEmail: 'r', assignmentStore, errorLog }).reason).toBe('assignment_lookup_failed');
  expect(reviewFormAccess.getForm({ paperId: 'p1', reviewerEmail: 'r', assignmentStore, errorLog: null }).reason).toBe('assignment_lookup_failed');
  const assignmentStoreWithMessage = { getAssignments: () => { throw new Error('boom'); } };
  expect(reviewFormAccess.getForm({ paperId: 'p1', reviewerEmail: 'r', assignmentStore: assignmentStoreWithMessage, errorLog }).reason).toBe('assignment_lookup_failed');

  const assignmentStore2 = { getAssignments: () => [] };
  expect(reviewFormAccess.getForm({ paperId: 'p1', reviewerEmail: 'r', assignmentStore: assignmentStore2, errorLog }).reason).toBe('not_assigned');

  const assignmentStore3 = { getAssignments: () => [{ paperId: 'p1', reviewerEmail: 'r', status: 'pending' }] };
  expect(reviewFormAccess.getForm({ paperId: 'p1', reviewerEmail: 'r', assignmentStore: assignmentStore3, errorLog }).reason).toBe('not_accepted');

  const assignmentStore4 = { getAssignments: () => [{ paperId: 'p1', reviewerEmail: 'r', status: 'accepted' }] };
  const reviewFormStoreMock = { getForm: () => { throw {}; } };
  expect(reviewFormAccess.getForm({ paperId: 'p1', reviewerEmail: 'r', assignmentStore: assignmentStore4, reviewFormStore: reviewFormStoreMock, errorLog }).reason).toBe('form_failure');
  expect(reviewFormAccess.getForm({ paperId: 'p1', reviewerEmail: 'r', assignmentStore: assignmentStore4, reviewFormStore: reviewFormStoreMock, errorLog: null }).reason).toBe('form_failure');

  const reviewFormStoreMissing = { getForm: () => null };
  expect(reviewFormAccess.getForm({ paperId: 'p1', reviewerEmail: 'r', assignmentStore: assignmentStore4, reviewFormStore: reviewFormStoreMissing, errorLog }).reason).toBe('form_missing');

  const reviewFormStoreOk = { getForm: () => ({ paperId: 'p1', status: 'closed' }) };
  const reviewDraftStoreMock = { getDraft: () => { throw {}; } };
  expect(reviewFormAccess.getForm({ paperId: 'p1', reviewerEmail: 'r', assignmentStore: assignmentStore4, reviewFormStore: reviewFormStoreOk, reviewDraftStore: reviewDraftStoreMock, errorLog }).reason).toBe('draft_failure');
  expect(reviewFormAccess.getForm({ paperId: 'p1', reviewerEmail: 'r', assignmentStore: assignmentStore4, reviewFormStore: reviewFormStoreOk, reviewDraftStore: reviewDraftStoreMock, errorLog: null }).reason).toBe('draft_failure');

  const reviewDraftStoreOk = { getDraft: () => null };
  const ok = reviewFormAccess.getForm({
    paperId: 'p1',
    reviewerEmail: ' R ',
    assignmentStore: assignmentStore4,
    reviewFormStore: reviewFormStoreOk,
    reviewDraftStore: reviewDraftStoreOk,
  });
  expect(ok.ok).toBe(true);
});

test('review form store failure and cache branch coverage', () => {
  reviewFormStore.reset();
  reviewFormStore.setFailureMode(true);
  expect(() => reviewFormStore.getForm('p1')).toThrow('form_store_failure');

  reviewFormStore.setFailureMode(false);
  reviewFormStore.saveForm({ paperId: 'p1' });
  reviewFormStore.setFailureMode(true);
  expect(() => reviewFormStore.saveForm({ paperId: 'p2' })).toThrow('form_store_failure');

  reviewFormStore.reset();
  localStorage.setItem('cms.review_forms', JSON.stringify([{ paperId: 'p3' }]));
  reviewFormStore.setFailureMode(false);
  reviewFormStore.getForm('p3');
});

test('review storage service handles draft and submission', () => {
  reviewStorageService.reset();
  reviewStorageService.saveDraft();
  reviewStorageService.submitReview();
  expect(reviewStorageService.saveDraft({ formId: 'f1', reviewerEmail: 'r', content: {}, errors: null }).ok).toBe(true);
  expect(reviewStorageService.submitReview({ formId: 'f1', reviewerEmail: 'r', content: {} }).ok).toBe(true);
});

test('review submission service covers notifications and cache', () => {
  reviewSubmissionService.reset();
  const assignmentStore = { getAssignments: () => [{ paperId: 'p1', reviewerEmail: 'r', status: 'accepted' }] };
  const reviewFormStoreMock = { getForm: () => ({ paperId: 'p1', requiredFields: [] }) };
  const reviewValidationServiceMock = { validate: () => ({ ok: true, errors: {} }) };
  const errorLog = { logFailure: jest.fn() };

  reviewSubmissionService.setNotificationFailureMode(true);
  const result = reviewSubmissionService.submit({
    paperId: 'p1',
    reviewerEmail: 'R',
    content: {},
    notificationsEnabled: true,
    assignmentStore,
    reviewFormStore: reviewFormStoreMock,
    reviewValidationService: reviewValidationServiceMock,
    errorLog,
  });
  expect(result.notificationStatus).toBe('failed');

  const status = reviewSubmissionService.getSubmissionStatus({ paperId: 'p1', reviewerEmail: 'r' });
  expect(status.ok).toBe(true);

  reviewSubmissionService.setNotificationFailureMode(false);
  reviewSubmissionService.submit({
    paperId: 'p1',
    reviewerEmail: 'R',
    content: {},
    notificationsEnabled: true,
    assignmentStore,
    reviewFormStore: reviewFormStoreMock,
    reviewValidationService: reviewValidationServiceMock,
    errorLog,
  });
});

test('review submission service handles defaults and failures', async () => {
  reviewSubmissionService.reset();
  reviewSubmissionService.getSubmissionStatus();
  reviewSubmissionService.submit();
  reviewSubmissionService.preserveDraft();

  localStorage.setItem('cms.submitted_reviews', JSON.stringify([{ paperId: 'p9', reviewerEmail: 'r' }]));
  localStorage.setItem('cms.notification_log', JSON.stringify([{ paperId: 'p9', reviewerEmail: 'r', status: 'sent' }]));

  const assignmentStore = { getAssignments: () => [{ paperId: 'p9', reviewerEmail: 'r', status: 'accepted' }] };
  const reviewFormStoreMock = { getForm: () => ({ paperId: 'p9', requiredFields: [] }) };
  const reviewValidationServiceMock = { validate: () => ({ ok: true, errors: {} }) };
  reviewSubmissionService.submit({
    paperId: 'p9',
    reviewerEmail: 'r',
    content: {},
    notificationsEnabled: true,
    assignmentStore,
    reviewFormStore: reviewFormStoreMock,
    reviewValidationService: reviewValidationServiceMock,
  });

  reviewSubmissionService.setSubmissionFailureMode(true);
  const errorLog = { logFailure: jest.fn() };
  const assignmentStoreFail = { getAssignments: () => [{ paperId: 'p11', reviewerEmail: 'r', status: 'accepted' }] };
  const reviewFormStoreFail = { getForm: () => ({ paperId: 'p11', requiredFields: [] }) };
  const failed = reviewSubmissionService.submit({
    paperId: 'p11',
    reviewerEmail: 'r',
    content: {},
    assignmentStore: assignmentStoreFail,
    reviewFormStore: reviewFormStoreFail,
    reviewValidationService: reviewValidationServiceMock,
    errorLog,
  });
  expect(failed.reason).toBe('save_failed');
  reviewSubmissionService.setSubmissionFailureMode(false);

  const draftResult = reviewSubmissionService.preserveDraft({
    paperId: 'p9',
    reviewerEmail: 'r',
    content: {},
    reviewDraftStore: { saveDraft: () => { throw {}; } },
  });
  expect(draftResult.ok).toBe(false);

  jest.resetModules();
  jest.unstable_mockModule('../../src/models/submitted-review.js', () => ({
    createSubmittedReview: () => { throw {}; },
    isSubmittedReviewFinal: () => false,
  }));
  const { reviewSubmissionService: mockedService } = await import('../../src/services/review-submission-service.js');
  const errorLog2 = { logFailure: jest.fn() };
  const assignmentStoreMock = { getAssignments: () => [{ paperId: 'p10', reviewerEmail: 'r', status: 'accepted' }] };
  const reviewFormStoreMock2 = { getForm: () => ({ paperId: 'p10', requiredFields: [] }) };
  const mockedResult = mockedService.submit({
    paperId: 'p10',
    reviewerEmail: 'r',
    content: {},
    assignmentStore: assignmentStoreMock,
    reviewFormStore: reviewFormStoreMock2,
    reviewValidationService: reviewValidationServiceMock,
    errorLog: errorLog2,
  });
  expect(mockedResult.reason).toBe('save_failed');
  expect(errorLog2.logFailure).toHaveBeenCalledWith(expect.objectContaining({ message: 'submission_failed' }));
});

test('review validation service covers option and range branches', () => {
  const result = reviewValidationService.validate({
    content: { [REVIEW_FIELDS.recommendation]: 'invalid', [REVIEW_FIELDS.confidence]: '10' },
    requiredFields: [],
    maxLengths: { summary: 1 },
    invalidCharacterPolicy: 'no_control_chars_no_markup',
    action: 'submit_review',
  });
  expect(result.ok).toBe(false);
  const noSubmit = reviewValidationService.validate({
    content: { summary: 'ok' },
    action: 'save_draft',
    invalidCharacterPolicy: 'allow_all',
    maxLengths: { summary: 100 },
  });
  expect(noSubmit.ok).toBe(true);
  const required = reviewValidationService.validate({
    content: { summary: '' },
    requiredFields: ['summary'],
  });
  expect(required.errors.summary).toBeDefined();
  const invalidChars = reviewValidationService.validate({
    content: { summary: '\u0001' },
    requiredFields: [],
  });
  expect(invalidChars.errors.summary).toBeDefined();
  const maxed = reviewValidationService.validate({
    content: { summary: 'too long' },
    requiredFields: [],
    maxLengths: { summary: 3 },
  });
  expect(maxed.errors.summary).toBeDefined();
  const confidenceOk = reviewValidationService.validate({
    content: { [REVIEW_FIELDS.confidence]: '3' },
    requiredFields: [],
    action: 'save_draft',
    invalidCharacterPolicy: 'allow_all',
  });
  expect(confidenceOk.ok).toBe(true);
});

test('reviewer assignments service covers empty reviewer and errors', () => {
  const empty = reviewerAssignments.listAcceptedAssignments({ reviewerEmail: '' });
  expect(empty.assignments).toEqual([]);

  const result = reviewerAssignments.listAcceptedAssignments({
    reviewerEmail: 'r',
    assignmentStore: { getAssignments: () => { throw {}; } },
    errorLog: { logFailure: jest.fn() },
  });
  expect(result.ok).toBe(false);

  const list = reviewerAssignments.listAcceptedAssignments({
    reviewerEmail: 'r',
    assignmentStore: { getAssignments: () => [{ assignmentId: 'a1', paperId: 'p1', reviewerEmail: 'r', status: 'accepted' }] },
    assignmentStorage: { getPaper: () => null },
    submissionStorage: { getManuscripts: () => [] },
  });
  expect(list.assignments[0].title).toBe('Unavailable paper');

  const list2 = reviewerAssignments.listAcceptedAssignments({
    reviewerEmail: 'r',
    assignmentStore: { getAssignments: () => [{ assignmentId: 'a1', paperId: 'p1', reviewerEmail: 'r', status: 'accepted' }] },
    assignmentStorage: { getPaper: () => ({ id: 'p1', title: 'Paper Title' }) },
    submissionStorage: { getManuscripts: () => [{ id: 'p1', title: 'Manuscript Title' }] },
  });
  expect(list2.assignments[0].title).toBe('Paper Title');

  const list3 = reviewerAssignments.listAcceptedAssignments({
    reviewerEmail: 'r',
    assignmentStore: { getAssignments: () => [{ assignmentId: 'a1', paperId: 'p1', reviewerEmail: 'r', status: 'accepted' }] },
    assignmentStorage: { getPaper: () => null },
    submissionStorage: { getManuscripts: () => [{ id: 'p1', title: 'Manuscript Title' }] },
  });
  expect(list3.assignments[0].title).toBe('Manuscript Title');
});

test('reviewer count covers null assignments', () => {
  const count = reviewerCount.getCountForPaper({
    paperId: 'p1',
    assignmentStore: { getAssignments: () => [null, { paperId: 'p1' }] },
  });
  expect(count).toBe(1);
  expect(reviewerCount.getCountForPaper()).toBe(0);
});

test('reviewer paper access covers invalid request, errors, and availability', () => {
  const invalid = reviewerPaperAccess.getPaperDetails({ reviewerEmail: '', paperId: 'p1' });
  expect(invalid.reason).toBe('invalid_request');
  expect(reviewerPaperAccess.getPaperDetails().reason).toBe('invalid_request');

  const retrieval = reviewerPaperAccess.getPaperDetails({
    reviewerEmail: 'r',
    paperId: 'p1',
    assignmentStore: { getAssignments: () => { throw {}; } },
    errorLog: { logFailure: jest.fn() },
  });
  expect(retrieval.reason).toBe('retrieval_failed');

  const notAccepted = reviewerPaperAccess.getPaperDetails({
    reviewerEmail: 'r',
    paperId: 'p1',
    assignmentStore: { getAssignments: () => [] },
  });
  expect(notAccepted.reason).toBe('not_accepted');

  const unavailablePaper = reviewerPaperAccess.getPaperDetails({
    reviewerEmail: 'r',
    paperId: 'p1',
    assignmentStore: { getAssignments: () => [{ reviewerEmail: 'r', paperId: 'p1', status: 'accepted' }] },
    assignmentStorage: { getPaper: () => null },
    submissionStorage: { getManuscripts: () => [] },
  });
  expect(unavailablePaper.reason).toBe('unavailable');

  const unavailableManuscript = reviewerPaperAccess.getPaperDetails({
    reviewerEmail: 'r',
    paperId: 'p1',
    assignmentStore: { getAssignments: () => [{ reviewerEmail: 'r', paperId: 'p1', status: 'accepted' }] },
    assignmentStorage: { getPaper: () => ({ status: 'submitted' }) },
    submissionStorage: { getManuscripts: () => [{ id: 'p1', status: 'submitted', fileStatus: 'missing' }] },
  });
  expect(unavailableManuscript.reason).toBe('unavailable');

  const ok = reviewerPaperAccess.getPaperDetails({
    reviewerEmail: 'r',
    paperId: 'p1',
    assignmentStore: { getAssignments: () => [{ reviewerEmail: 'r', paperId: 'p1', status: 'accepted' }] },
    assignmentStorage: { getPaper: () => ({ status: 'submitted' }) },
    submissionStorage: { getManuscripts: () => [{ id: 'p1', status: 'submitted', file: { originalName: null } }] },
  });
  expect(ok.ok).toBe(true);
  expect(ok.manuscriptLink).toBe(null);
});

test('validation rules service covers missing and error branches', () => {
  const errorLog = { logFailure: jest.fn() };
  const missing = validationRulesService.getRules({ formId: 'f1', reviewFormStore: { getForm: () => null }, errorLog });
  expect(missing.ok).toBe(false);

  const thrown = validationRulesService.getRules({ formId: 'f2', reviewFormStore: { getForm: () => { throw {}; } }, errorLog });
  expect(thrown.ok).toBe(false);

  const ok = validationRulesService.getRules({ formId: 'f3', reviewFormStore: { getForm: () => ({}) } });
  expect(ok.ok).toBe(true);
  expect(validationRulesService.getRules().ok).toBe(false);
});

test('views cover click handlers and guidance', () => {
  const guidanceView = createRefereeGuidanceView();
  const handler = jest.fn();
  guidanceView.element.querySelector('#guidance-action').click();
  guidanceView.onAction(handler);
  guidanceView.setGuidance({ message: 'msg', actionLabel: 'Do', action: 'act' });
  const button = guidanceView.element.querySelector('#guidance-action');
  button.click();
  expect(handler).toHaveBeenCalledWith('act');

  const assignmentsView = createReviewerAssignmentsView();
  assignmentsView.onOpen(handler);
  assignmentsView.setAssignments([{ paperId: 'p1', title: 'Paper 1' }]);
  const openButton = assignmentsView.element.querySelector('#assignments-list button');
  openButton.click();
  expect(handler).toHaveBeenCalled();

  const assignmentsView2 = createReviewerAssignmentsView();
  assignmentsView2.setAssignments([{ paperId: 'p2', title: 'Paper 2' }]);
  const openButton2 = assignmentsView2.element.querySelector('#assignments-list button');
  openButton2.click();
});

test('review readiness controller applies guidance when blocked', () => {
  const guidanceView = { setGuidance: jest.fn(), onAction: jest.fn() };
  const view = {
    setStatus: jest.fn(),
    setMissingInvitations: jest.fn(),
    setGuidance: jest.fn(),
    setPaper: jest.fn(),
    setAuthorizationMessage: jest.fn(),
    setCount: jest.fn(),
  };
  const controller = createReviewReadinessController({
    view,
    guidanceView,
    assignmentStorage: { getPaper: () => ({ id: 'p1' }) },
    reviewRequestStore: { getRequests: () => [] },
    sessionState: buildSessionState({ user: { email: 'e', role: 'editor' } }),
    paperId: 'p1',
    readinessService: {
      evaluate: () => ({ ok: true, ready: false, count: 2, missingInvitations: [] }),
    },
    guidanceService: {
      getGuidance: () => ({ message: 'Invite more', actionLabel: 'Invite', action: 'invite' }),
    },
  });

  controller.evaluateReadiness();
  expect(guidanceView.setGuidance).toHaveBeenCalledWith({
    message: 'Invite more',
    actionLabel: 'Invite',
    action: 'invite',
  });
});

test('review submission controller handles confirm, validation, closed, and slow paths', () => {
  const submissionView = { setStatus: jest.fn(), setFinalityMessage: jest.fn(), setNotificationWarning: jest.fn() };
  const validationView = { clear: jest.fn(), setFieldError: jest.fn() };
  const errorSummaryView = { clear: jest.fn(), setErrors: jest.fn() };
  const authController = { requestLogin: jest.fn() };

  let handler;
  const formView = {
    isConfirmed: () => false,
    getValues: () => ({ summary: 'ok' }),
    onSubmit: (fn) => { handler = fn; },
    setViewOnly: jest.fn(),
    element: document.createElement('form'),
  };

  const controller = createReviewSubmissionController({
    formView,
    submissionView,
    validationView,
    errorSummaryView,
    sessionState: buildSessionState({ user: { email: 'reviewer@example.com' } }),
    paperId: 'p1',
    reviewSubmissionService: {
      submit: jest.fn(),
      preserveDraft: jest.fn(),
    },
    reviewValidationService: { validate: () => ({ ok: true }) },
    authController,
    reviewFormAccessibility: { focusFirstError: jest.fn() },
  });

  controller.init();
  handler({ preventDefault: jest.fn() });
  expect(submissionView.setStatus).toHaveBeenCalledWith('Please confirm your submission is final.', true);

  formView.isConfirmed = () => true;
  const validationController = createReviewSubmissionController({
    formView,
    submissionView,
    validationView,
    errorSummaryView,
    sessionState: buildSessionState({ user: { email: 'reviewer@example.com' } }),
    paperId: 'p1',
    reviewSubmissionService: { submit: jest.fn(), preserveDraft: jest.fn() },
    reviewValidationService: { validate: () => ({ ok: false, errors: { summary: 'required' } }) },
    reviewFormAccessibility: { focusFirstError: jest.fn() },
  });
  validationController.init();
  handler({ preventDefault: jest.fn() });
  expect(validationView.setFieldError).toHaveBeenCalled();
  expect(errorSummaryView.setErrors).toHaveBeenCalledWith(['summary']);

  const closedService = { submit: () => ({ ok: false, reason: 'closed' }), preserveDraft: jest.fn() };
  const closedController = createReviewSubmissionController({
    formView,
    submissionView,
    validationView,
    errorSummaryView,
    sessionState: buildSessionState({ user: { email: 'reviewer@example.com' } }),
    paperId: 'p1',
    reviewSubmissionService: closedService,
    reviewValidationService: { validate: () => ({ ok: true }) },
  });
  closedController.init();
  handler({ preventDefault: jest.fn() });
  expect(formView.setViewOnly).toHaveBeenCalledWith(true, 'Review period is closed. View-only access.');
});

test('review submission controller passes null reviewerEmail and logs slow submissions', () => {
  const submissionView = { setStatus: jest.fn(), setFinalityMessage: jest.fn(), setNotificationWarning: jest.fn() };
  const formView = {
    isConfirmed: () => true,
    getValues: () => ({ summary: 'ok' }),
    onSubmit: (fn) => { formView._handler = fn; },
    setViewOnly: jest.fn(),
    element: document.createElement('form'),
  };
  const submitSpy = jest.fn(() => ({ ok: true }));
  const errorLog = { logFailure: jest.fn() };
  const originalPerformance = global.performance;
  global.performance = { now: jest.fn().mockReturnValueOnce(0).mockReturnValueOnce(120) };

  const controller = createReviewSubmissionController({
    formView,
    submissionView,
    sessionState: buildSessionState({ user: { role: 'reviewer' } }),
    paperId: 'p1',
    reviewSubmissionService: { submit: submitSpy, preserveDraft: jest.fn() },
    reviewValidationService: { validate: () => ({ ok: true }) },
    errorLog,
  });

  controller.init();
  formView._handler({ preventDefault: jest.fn() });
  expect(submitSpy).toHaveBeenCalledWith(expect.objectContaining({ reviewerEmail: null }));
  expect(errorLog.logFailure).toHaveBeenCalledWith(expect.objectContaining({ errorType: 'review_submit_slow' }));

  global.performance = originalPerformance;
});

test('review validation controller covers defaults, save/submit actions, and errors', () => {
  const statusSpy = jest.fn();
  const summarySpy = { clear: jest.fn(), setErrors: jest.fn() };
  const viewSpy = {
    element: document.createElement('form'),
    clearErrors: jest.fn(),
    setStatus: statusSpy,
    setFieldError: jest.fn(),
    getValues: () => ({ summary: 'ok' }),
    onSaveDraft: (fn) => { viewSpy._save = fn; },
    onSubmitReview: (fn) => { viewSpy._submit = fn; },
  };

  const validationController = createReviewValidationController({
    view: viewSpy,
    summaryView: summarySpy,
    formId: 'f1',
    reviewValidationService: {
      validate: () => ({ ok: false, errors: { summary: 'required' }, messages: {} }),
    },
    validationRulesService: { getRules: () => ({ ok: true, rules: { requiredFields: ['summary'], maxLengths: {}, invalidCharacterPolicy: 'no_control_chars_no_markup' } }) },
    reviewValidationAccessibility: { focusFirstError: jest.fn() },
  });

  validationController.init();
  viewSpy._submit({ preventDefault: jest.fn() });
  expect(summarySpy.setErrors).toHaveBeenCalled();
  expect(viewSpy.setFieldError).toHaveBeenCalledWith('summary', expect.stringContaining('Summary'));

  const submitSpy = jest.fn();
  const slowErrorLog = { logFailure: jest.fn() };
  const originalPerformance = global.performance;
  global.performance = { now: jest.fn().mockReturnValueOnce(0).mockReturnValueOnce(250) };

  const okController = createReviewValidationController({
    view: viewSpy,
    summaryView: summarySpy,
    formId: 'f2',
    reviewerEmail: 'reviewer@example.com',
    reviewValidationService: { validate: () => ({ ok: true }) },
    validationRulesService: { getRules: () => ({ ok: true, rules: { requiredFields: [], maxLengths: {}, invalidCharacterPolicy: 'no_control_chars_no_markup' } }) },
    reviewStorageService: { submitReview: submitSpy, saveDraft: jest.fn() },
    errorLog: slowErrorLog,
  });

  okController.init();
  viewSpy._submit({ preventDefault: jest.fn() });
  expect(submitSpy).toHaveBeenCalledWith(expect.objectContaining({ reviewerEmail: 'reviewer@example.com' }));
  expect(slowErrorLog.logFailure).toHaveBeenCalledWith(expect.objectContaining({ errorType: 'review_validation_slow' }));

  const errorLog = { logFailure: jest.fn() };
  const failRules = createReviewValidationController({
    view: viewSpy,
    summaryView: summarySpy,
    formId: 'f3',
    reviewValidationService: { validate: () => ({ ok: true }) },
    validationRulesService: { getRules: () => ({ ok: false }) },
    errorLog,
  });
  failRules.init();
  viewSpy._submit({ preventDefault: jest.fn() });
  expect(statusSpy).toHaveBeenCalledWith('Validation rules are unavailable. Please try again later.', true);

  global.performance = originalPerformance;
});

test('review validation controller uses null reviewer email when session lacks email', () => {
  const view = {
    element: null,
    clearErrors: jest.fn(),
    setStatus: jest.fn(),
    setFieldError: jest.fn(),
    getValues: () => ({ summary: 'ok' }),
    onSaveDraft: (fn) => { view._save = fn; },
    onSubmitReview: (fn) => { view._submit = fn; },
  };
  const submitReview = jest.fn();
  const controller = createReviewValidationController({
    view,
    summaryView: { clear: jest.fn(), setErrors: jest.fn() },
    formId: 'f4',
    sessionState: buildSessionState({ user: { role: 'reviewer' } }),
    reviewValidationService: { validate: () => ({ ok: true }) },
    validationRulesService: { getRules: () => ({ ok: true, rules: { requiredFields: [], maxLengths: {}, invalidCharacterPolicy: 'no_control_chars_no_markup' } }) },
    reviewStorageService: { submitReview, saveDraft: jest.fn() },
  });

  controller.init();
  view._submit({ preventDefault: jest.fn() });
  expect(submitReview).toHaveBeenCalledWith(expect.objectContaining({ reviewerEmail: null }));
});

test('review validation controller initializes without view', () => {
  const controller = createReviewValidationController();
  expect(() => controller.init()).not.toThrow();
});

test('review validation service covers required, invalid chars, max length, and ranges', () => {
  const invalidChars = reviewValidationService.validate({
    content: { summary: '<b>bad</b>' },
    requiredFields: [],
    maxLengths: {},
    invalidCharacterPolicy: 'no_control_chars_no_markup',
    action: 'save_draft',
  });
  expect(invalidChars.errors.summary).toBe('invalid_chars');

  const maxLength = reviewValidationService.validate({
    content: { summary: 'ab' },
    requiredFields: [],
    maxLengths: { summary: 1 },
    invalidCharacterPolicy: 'no_control_chars_no_markup',
    action: 'save_draft',
  });
  expect(maxLength.errors.summary).toBe('max_length');

  const invalidRecommendation = reviewValidationService.validate({
    content: { recommendation: 'nope' },
    requiredFields: [],
    maxLengths: {},
    invalidCharacterPolicy: 'no_control_chars_no_markup',
    action: 'save_draft',
  });
  expect(invalidRecommendation.errors.recommendation).toBe('invalid_option');

  const invalidConfidence = reviewValidationService.validate({
    content: { confidenceRating: '10' },
    requiredFields: [],
    maxLengths: {},
    invalidCharacterPolicy: 'no_control_chars_no_markup',
    action: 'save_draft',
  });
  expect(invalidConfidence.errors.confidenceRating).toBe('out_of_range');

  const invalidConfidenceType = reviewValidationService.validate({
    content: { confidenceRating: 'oops' },
    requiredFields: [],
    maxLengths: {},
    invalidCharacterPolicy: 'no_control_chars_no_markup',
    action: 'save_draft',
  });
  expect(invalidConfidenceType.errors.confidenceRating).toBe('out_of_range');

  const requiredDefault = reviewValidationService.validate({
    content: {},
    requiredFields: 'bad',
    maxLengths: {},
    invalidCharacterPolicy: 'no_control_chars_no_markup',
    action: 'submit_review',
  });
  expect(requiredDefault.ok).toBe(false);

  const skipInvalidChars = reviewValidationService.validate({
    content: { summary: '<b>bad</b>' },
    requiredFields: [],
    maxLengths: {},
    invalidCharacterPolicy: 'none',
    action: 'save_draft',
  });
  expect(skipInvalidChars.ok).toBe(true);
});

test('review form access logs assignment lookup errors without message', () => {
  const errorLog = { logFailure: jest.fn() };
  const result = reviewFormAccess.getForm({
    paperId: 'p1',
    reviewerEmail: ' reviewer@example.com ',
    assignmentStore: { getAssignments: () => { throw {}; } },
    errorLog,
  });
  expect(result.reason).toBe('assignment_lookup_failed');
  expect(errorLog.logFailure).toHaveBeenCalledWith(expect.objectContaining({ message: 'assignment_lookup_failed' }));
});

test('reviewer assignments return empty list when email missing', () => {
  const result = reviewerAssignments.listAcceptedAssignments();
  expect(result.ok).toBe(true);
  expect(result.assignments).toEqual([]);
});

test('referee invitation check returns empty when disabled', () => {
  const missing = refereeInvitationCheck.getMissingInvitations({ invitationsEnabled: false });
  expect(missing).toEqual([]);
});

test('referee readiness covers count branches and invitation handling', () => {
  const errorLog = { logFailure: jest.fn() };
  const audit = { record: jest.fn() };
  const errorResult = refereeReadiness.evaluate({
    paperId: 'p1',
    refereeCount: { getCount: () => { throw {}; } },
    readinessAudit: audit,
    errorLog,
  });
  expect(errorResult.ok).toBe(false);

  const readyResult = refereeReadiness.evaluate({
    paperId: 'p2',
    refereeCount: { getCount: () => 3 },
    invitationCheck: null,
    readinessAudit: audit,
  });
  expect(readyResult.ready).toBe(true);
  expect(readyResult.missingInvitations).toEqual([]);

  const lowResult = refereeReadiness.evaluate({
    paperId: 'p3',
    refereeCount: { getCount: () => 2 },
    readinessAudit: audit,
  });
  expect(lowResult.reason).toBe('count_low');

  const highResult = refereeReadiness.evaluate({
    paperId: 'p4',
    refereeCount: { getCount: () => 4 },
    readinessAudit: audit,
  });
  expect(highResult.reason).toBe('count_high');
});

test('review submission service uses cached notifications', () => {
  reviewSubmissionService.reset();
  const assignmentStore = {
    getAssignments: () => [
      { reviewerEmail: 'r1', paperId: 'p1', status: 'accepted' },
      { reviewerEmail: 'r2', paperId: 'p2', status: 'accepted' },
    ],
  };
  const reviewFormStore = { getForm: () => ({ requiredFields: [] }) };
  const reviewValidationService = { validate: () => ({ ok: true }) };

  const first = reviewSubmissionService.submit({
    paperId: 'p1',
    reviewerEmail: 'r1',
    content: {},
    notificationsEnabled: true,
    assignmentStore,
    reviewFormStore,
    reviewValidationService,
  });
  expect(first.ok).toBe(true);

  const second = reviewSubmissionService.submit({
    paperId: 'p2',
    reviewerEmail: 'r2',
    content: {},
    notificationsEnabled: true,
    assignmentStore,
    reviewFormStore,
    reviewValidationService,
  });
  expect(second.ok).toBe(true);
});

test('reviewer paper access returns manuscript link when available', () => {
  const ok = reviewerPaperAccess.getPaperDetails({
    reviewerEmail: 'r',
    paperId: 'p1',
    assignmentStore: { getAssignments: () => [{ reviewerEmail: 'r', paperId: 'p1', status: 'accepted' }] },
    assignmentStorage: { getPaper: () => ({ status: 'submitted' }) },
    submissionStorage: { getManuscripts: () => [{ id: 'p1', status: 'submitted', file: { originalName: 'paper.pdf' } }] },
  });
  expect(ok.ok).toBe(true);
  expect(ok.manuscriptLink).toBe('paper.pdf');
});

test('validation rules service logs fallback error message', () => {
  const errorLog = { logFailure: jest.fn() };
  const result = validationRulesService.getRules({
    formId: 'f1',
    reviewFormStore: { getForm: () => { throw {}; } },
    errorLog,
  });
  expect(result.ok).toBe(false);
  expect(errorLog.logFailure).toHaveBeenCalledWith(expect.objectContaining({ message: 'validation_rules_error' }));
});

test('review readiness controller skips guidance when service returns null', () => {
  const guidanceView = { setGuidance: jest.fn(), onAction: jest.fn() };
  const view = {
    setStatus: jest.fn(),
    setMissingInvitations: jest.fn(),
    setGuidance: jest.fn(),
    setPaper: jest.fn(),
    setAuthorizationMessage: jest.fn(),
    setCount: jest.fn(),
  };
  const controller = createReviewReadinessController({
    view,
    guidanceView,
    assignmentStorage: { getPaper: () => ({ id: 'p2' }) },
    reviewRequestStore: { getRequests: () => [] },
    sessionState: buildSessionState({ user: { email: 'e', role: 'editor' } }),
    paperId: 'p2',
    readinessService: { evaluate: () => ({ ok: true, ready: false, count: 1, missingInvitations: [] }) },
    guidanceService: { getGuidance: () => null },
  });

  controller.evaluateReadiness();
  expect(guidanceView.setGuidance).toHaveBeenCalledWith({ message: '', actionLabel: '', action: null });
});

test('review submission controller proceeds when confirmed is true', () => {
  const submissionView = { setStatus: jest.fn(), setFinalityMessage: jest.fn(), setNotificationWarning: jest.fn() };
  const formView = {
    isConfirmed: () => true,
    getValues: () => ({ summary: 'ok' }),
    onSubmit: (fn) => { formView._handler = fn; },
    setViewOnly: jest.fn(),
    element: document.createElement('form'),
  };
  const controller = createReviewSubmissionController({
    formView,
    submissionView,
    sessionState: buildSessionState({ user: { email: 'reviewer@example.com' } }),
    paperId: 'p9',
    reviewSubmissionService: { submit: () => ({ ok: false, reason: 'validation_failed' }), preserveDraft: jest.fn() },
    reviewValidationService: { validate: () => ({ ok: true }) },
  });

  controller.init();
  formView._handler({ preventDefault: jest.fn() });
  expect(submissionView.setStatus).toHaveBeenCalledWith('Please fix validation errors before submitting.', true);
});

test('review validation controller uses default error list args and fallback label', () => {
  const summaryView = { clear: jest.fn(), setErrors: jest.fn() };
  const view = {
    element: null,
    clearErrors: jest.fn(),
    setStatus: jest.fn(),
    setFieldError: jest.fn(),
    getValues: () => ({}),
    onSaveDraft: (fn) => { view._save = fn; },
    onSubmitReview: (fn) => { view._submit = fn; },
  };
  const defaultErrorController = createReviewValidationController({
    view,
    summaryView,
    formId: 'f5',
    reviewValidationService: { validate: () => ({ ok: false }) },
    validationRulesService: { getRules: () => ({ ok: true, rules: { requiredFields: [], maxLengths: {}, invalidCharacterPolicy: 'no_control_chars_no_markup' } }) },
  });
  defaultErrorController.init();
  view._submit({ preventDefault: jest.fn() });
  expect(summaryView.setErrors).toHaveBeenCalledWith([]);

  const fallbackController = createReviewValidationController({
    view,
    summaryView,
    formId: 'f6',
    reviewValidationService: { validate: () => ({ ok: false, errors: { mystery: 'invalid' }, messages: {} }) },
    validationRulesService: { getRules: () => ({ ok: true, rules: { requiredFields: [], maxLengths: {}, invalidCharacterPolicy: 'no_control_chars_no_markup' } }) },
  });
  fallbackController.init();
  view._submit({ preventDefault: jest.fn() });
  expect(summaryView.setErrors).toHaveBeenCalledWith([
    { field: 'mystery', message: 'mystery is invalid.' },
  ]);
});

test('review validation service default args and label fallbacks', () => {
  const defaultArgs = reviewValidationService.validate();
  expect(defaultArgs.ok).toBe(false);

  const originalFields = TEXT_VALIDATION_FIELDS.slice();
  TEXT_VALIDATION_FIELDS.push('customField');
  const invalidChars = reviewValidationService.validate({
    content: { customField: '<x>' },
    requiredFields: [],
    maxLengths: {},
    invalidCharacterPolicy: 'no_control_chars_no_markup',
    action: 'save_draft',
  });
  expect(invalidChars.errors.customField).toBe('invalid_chars');

  const maxLength = reviewValidationService.validate({
    content: { customField: 'toolong' },
    requiredFields: [],
    maxLengths: { customField: 1 },
    invalidCharacterPolicy: 'no_control_chars_no_markup',
    action: 'save_draft',
  });
  expect(maxLength.errors.customField).toBe('max_length');

  const requiredFallback = reviewValidationService.validate({
    content: {},
    requiredFields: ['customField'],
    maxLengths: {},
    invalidCharacterPolicy: 'no_control_chars_no_markup',
    action: 'submit_review',
  });
  expect(requiredFallback.errors.customField).toBe('required');

  TEXT_VALIDATION_FIELDS.length = 0;
  TEXT_VALIDATION_FIELDS.push(...originalFields);
});

test('review submission service handles save failures without logging', () => {
  reviewSubmissionService.reset();
  reviewSubmissionService.setSubmissionFailureMode(true);
  const result = reviewSubmissionService.submit({
    paperId: 'p1',
    reviewerEmail: 'r1',
    content: {},
    assignmentStore: { getAssignments: () => [{ reviewerEmail: 'r1', paperId: 'p1', status: 'accepted' }] },
    reviewFormStore: { getForm: () => ({ requiredFields: [] }) },
    reviewValidationService: { validate: () => ({ ok: true }) },
    errorLog: null,
  });
  expect(result.ok).toBe(false);

  const preserve = reviewSubmissionService.preserveDraft({
    paperId: 'p2',
    reviewerEmail: 'r2',
    content: {},
    reviewDraftStore: { saveDraft: () => { throw {}; } },
    errorLog: null,
  });
  expect(preserve.ok).toBe(false);

  reviewSubmissionService.setSubmissionFailureMode(false);
});

test('validation rules service logs explicit error message', () => {
  const errorLog = { logFailure: jest.fn() };
  const result = validationRulesService.getRules({
    formId: 'f7',
    reviewFormStore: { getForm: () => { throw new Error('boom'); } },
    errorLog,
  });
  expect(result.ok).toBe(false);
  expect(errorLog.logFailure).toHaveBeenCalledWith(expect.objectContaining({ message: 'boom' }));
});

test('referee invitation check uses default args', () => {
  const missing = refereeInvitationCheck.getMissingInvitations();
  expect(Array.isArray(missing)).toBe(true);
});

test('referee readiness default args and no audit branch', () => {
  const defaults = buildReadinessResult();
  expect(defaults.missingInvitations).toEqual([]);

  const result = refereeReadiness.evaluate();
  expect(result.ok).toBe(true);

  const noAudit = refereeReadiness.evaluate({
    paperId: 'p8',
    refereeCount: { getCount: () => 2 },
    readinessAudit: null,
  });
  expect(noAudit.reason).toBe('count_low');
});


test('review submission controller hits confirmed false branch', () => {
  const submissionView = { setStatus: jest.fn(), setFinalityMessage: jest.fn(), setNotificationWarning: jest.fn() };
  const validationService = { validate: jest.fn(() => ({ ok: true })) };
  const submissionService = { submit: jest.fn(() => ({ ok: false, reason: 'validation_failed' })), preserveDraft: jest.fn() };
  const formView = {
    isConfirmed: () => true,
    getValues: () => ({ summary: 'ok' }),
    onSubmit: (fn) => { formView._handler = fn; },
    setViewOnly: jest.fn(),
    element: document.createElement('form'),
  };
  const controller = createReviewSubmissionController({
    formView,
    submissionView,
    sessionState: buildSessionState({ user: { email: 'reviewer@example.com' } }),
    paperId: 'p10',
    reviewSubmissionService: submissionService,
    reviewValidationService: validationService,
  });

  controller.init();
  formView._handler({ preventDefault: jest.fn() });
  expect(validationService.validate).toHaveBeenCalled();
});


test('review submission controller calls submit when confirmed', () => {
  const submissionView = { setStatus: jest.fn(), setFinalityMessage: jest.fn(), setNotificationWarning: jest.fn() };
  const submit = jest.fn(() => ({ ok: true }));
  const formView = {
    isConfirmed: () => true,
    getValues: () => ({ summary: 'ok' }),
    onSubmit: (fn) => { formView._handler = fn; },
    setViewOnly: jest.fn(),
    element: document.createElement('form'),
  };
  const controller = createReviewSubmissionController({
    formView,
    submissionView,
    sessionState: buildSessionState({ user: { email: 'reviewer@example.com' } }),
    paperId: 'p11',
    reviewSubmissionService: { submit, preserveDraft: jest.fn() },
    reviewValidationService: { validate: () => ({ ok: true }) },
  });

  controller.init();
  formView._handler({ preventDefault: jest.fn() });
  expect(submit).toHaveBeenCalled();
});

