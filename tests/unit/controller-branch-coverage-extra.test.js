import { jest } from '@jest/globals';
import { createRefereeAssignmentController } from '../../src/controllers/referee-assignment-controller.js';
import { createReviewFormController } from '../../src/controllers/review-form-controller.js';
import { createReviewReadinessController } from '../../src/controllers/review-readiness-controller.js';
import { createReviewStatusController } from '../../src/controllers/review-status-controller.js';
import { createReviewSubmissionController } from '../../src/controllers/review-submission-controller.js';
import { createReviewSubmitController } from '../../src/controllers/review-submit-controller.js';
import { createReviewValidationController } from '../../src/controllers/review-validation-controller.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('referee assignment controller returns paper_not_found when missing paper', () => {
  const view = {
    setStatus: jest.fn(),
    setEditable: jest.fn(),
    setPaper: jest.fn(),
    onSubmit: jest.fn(),
  };
  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage: { getPaper: () => null },
    sessionState: {
      isAuthenticated: () => true,
      getCurrentUser: () => ({ role: 'editor' }),
    },
    paperId: 'missing',
  });

  const addResult = controller.addReferees(['a@example.com']);
  expect(addResult).toEqual({ ok: false, reason: 'paper_not_found' });

  const removeResult = controller.removeReferees(['a@example.com']);
  expect(removeResult).toEqual({ ok: false, reason: 'paper_not_found' });
});

test('referee assignment controller handles count check failure without violation log', () => {
  const view = {
    setStatus: jest.fn(),
    setEditable: jest.fn(),
    setPaper: jest.fn(),
    clearErrors: jest.fn(),
    setAuthorizationMessage: jest.fn(),
    setWarning: jest.fn(),
    setSummary: jest.fn(),
    setFallbackSummary: jest.fn(),
    setCountError: jest.fn(),
    setFieldError: jest.fn(),
    getRefereeEmails: jest.fn(() => ['referee@example.com']),
    onSubmit: jest.fn(),
  };
  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage: { getPaper: () => ({ id: 'paper_1', status: 'submitted', assignmentVersion: 0 }) },
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ role: 'editor' }) },
    paperId: 'paper_1',
    violationLog: null,
    overassignmentCheck: { evaluate: () => ({ ok: false }) },
  });

  controller.init();
  const submitHandler = view.onSubmit.mock.calls.at(-1)[0];
  submitHandler({ preventDefault: () => {} });
  expect(view.setStatus).toHaveBeenCalledWith(
    'Assignments cannot be completed. Reviewer count could not be determined. Please try again.',
    true,
  );
});

test('referee assignment controller returns update_failed when storage throws without message', () => {
  const view = {
    setStatus: jest.fn(),
    setEditable: jest.fn(),
    setPaper: jest.fn(),
    onSubmit: jest.fn(),
  };
  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage: {
      getPaper: () => ({ id: 'paper_1', status: 'submitted', assignmentVersion: 0, assignedRefereeEmails: [] }),
      saveAssignments: () => { throw {}; },
    },
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ role: 'editor' }) },
    paperId: 'paper_1',
  });

  const result = controller.removeReferees(['referee@example.com']);
  expect(result).toEqual({ ok: false, reason: 'update_failed' });
});

test('review form controller skips auth redirect when authController is null', () => {
  const view = { setStatus: jest.fn(), setForm: jest.fn(), setDraft: jest.fn(), setViewOnly: jest.fn() };
  const controller = createReviewFormController({
    view,
    sessionState: { isAuthenticated: () => false, getCurrentUser: () => null },
    paperId: 'paper_1',
    authController: null,
  });

  controller.init();
  expect(view.setStatus).toHaveBeenCalledWith('Please log in to access the review form.', true);
});

test('review form controller allows reviewer without email to load failure', () => {
  const view = { setStatus: jest.fn(), setForm: jest.fn(), setDraft: jest.fn(), setViewOnly: jest.fn() };
  const controller = createReviewFormController({
    view,
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({}) },
    paperId: 'paper_1',
    reviewFormAccess: { getForm: () => ({ ok: false, reason: 'not_assigned' }) },
  });

  controller.init();
  expect(view.setStatus).toHaveBeenCalledWith('You are not authorized to access this review form.', true);
});

test('review readiness controller skips guidance when service returns null', () => {
  const view = {
    setStatus: jest.fn(),
    setMissingInvitations: jest.fn(),
    setGuidance: jest.fn(),
    setPaper: jest.fn(),
    setAuthorizationMessage: jest.fn(),
    setCount: jest.fn(),
  };
  const guidanceView = { setGuidance: jest.fn(), onAction: jest.fn() };
  const controller = createReviewReadinessController({
    view,
    guidanceView,
    assignmentStorage: { getPaper: () => ({ id: 'paper_1', status: 'submitted' }) },
    reviewRequestStore: {},
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ role: 'editor' }) },
    paperId: 'paper_1',
    readinessService: { evaluate: () => ({ ok: true, ready: false, count: 2, missingInvitations: [] }) },
    guidanceService: { getGuidance: () => null },
  });

  controller.evaluateReadiness();
  expect(guidanceView.setGuidance).toHaveBeenCalled();
  expect(guidanceView.setGuidance).toHaveBeenCalledWith({ message: '', actionLabel: '', action: null });
});

test('review readiness controller handles unauthenticated access with auth callback', () => {
  const view = {
    setStatus: jest.fn(),
    setMissingInvitations: jest.fn(),
    setGuidance: jest.fn(),
    setPaper: jest.fn(),
    setAuthorizationMessage: jest.fn(),
    setCount: jest.fn(),
  };
  const onAuthRequired = jest.fn();
  const controller = createReviewReadinessController({
    view,
    guidanceView: null,
    assignmentStorage: { getPaper: () => ({ id: 'paper_2', status: 'submitted' }) },
    reviewRequestStore: {},
    sessionState: { isAuthenticated: () => false, getCurrentUser: () => null },
    paperId: 'paper_2',
    readinessService: { evaluate: () => ({ ok: true, ready: true, count: 3, missingInvitations: [] }) },
    onAuthRequired,
  });

  const result = controller.evaluateReadiness();
  expect(result).toEqual({ ok: false, ready: false, reason: 'unauthorized' });
  expect(onAuthRequired).toHaveBeenCalled();
});

test('review readiness controller rejects non-editor users', () => {
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
    guidanceView: null,
    assignmentStorage: { getPaper: () => ({ id: 'paper_1', status: 'submitted' }) },
    reviewRequestStore: {},
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ role: 'reviewer' }) },
    paperId: 'paper_1',
    readinessService: { evaluate: () => ({ ok: true, ready: true, count: 3, missingInvitations: [] }) },
  });

  const result = controller.evaluateReadiness();
  expect(result).toEqual({ ok: false, ready: false, reason: 'unauthorized' });
  expect(view.setAuthorizationMessage).toHaveBeenCalledWith('You do not have permission to start review.');
});

test('review status controller handles null reviewer email', () => {
  const view = { setStatus: jest.fn() };
  const reviewStatusService = { getStatus: jest.fn(() => ({ ok: false })) };
  const controller = createReviewStatusController({
    view,
    sessionState: { getCurrentUser: () => null },
    paperId: 'paper_1',
    reviewStatusService,
  });

  controller.init();
  expect(reviewStatusService.getStatus).toHaveBeenCalledWith({ paperId: 'paper_1', reviewerEmail: null });
});

test('review status controller handles missing reviewer email field', () => {
  const view = { setStatus: jest.fn() };
  const reviewStatusService = { getStatus: jest.fn(() => ({ ok: false })) };
  const controller = createReviewStatusController({
    view,
    sessionState: { getCurrentUser: () => ({}) },
    paperId: 'paper_2',
    reviewStatusService,
  });

  controller.init();
  expect(reviewStatusService.getStatus).toHaveBeenCalledWith({ paperId: 'paper_2', reviewerEmail: null });
});

test('review status controller shows success message when status ok', () => {
  const view = { setStatus: jest.fn() };
  const reviewStatusService = { getStatus: jest.fn(() => ({ ok: true, status: 'in progress' })) };
  const controller = createReviewStatusController({
    view,
    sessionState: { getCurrentUser: () => ({ email: 'rev@example.com' }) },
    paperId: 'paper_1',
    reviewStatusService,
  });

  controller.init();
  expect(view.setStatus).toHaveBeenCalledWith('Review status: in progress', false);
});

test('review submission controller handles confirm, validation, and closed branches', () => {
  const submissionView = { setStatus: jest.fn(), setFinalityMessage: jest.fn(), setNotificationWarning: jest.fn() };
  const formView = {
    isConfirmed: () => false,
    onSubmit: jest.fn(),
    getValues: () => ({ summary: 'ok' }),
    setViewOnly: jest.fn(),
    element: document.createElement('form'),
  };

  const controllerConfirm = createReviewSubmissionController({
    formView,
    submissionView,
    validationView: null,
    errorSummaryView: null,
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ email: 'rev@example.com' }) },
    paperId: 'paper_1',
    reviewValidationService: { validate: () => ({ ok: true }) },
    reviewSubmissionService: { submit: () => ({ ok: true }) },
  });
  controllerConfirm.init();
  const confirmHandler = formView.onSubmit.mock.calls.at(-1)[0];
  confirmHandler({ preventDefault: () => {} });
  expect(submissionView.setStatus).toHaveBeenCalledWith('Please confirm your submission is final.', true);

  const validationView = { clear: jest.fn(), setFieldError: jest.fn() };
  const errorSummaryView = { clear: jest.fn(), setErrors: jest.fn() };
  const reviewFormAccessibility = { focusFirstError: jest.fn() };
  formView.isConfirmed = () => true;
  const controllerValidation = createReviewSubmissionController({
    formView,
    submissionView,
    validationView,
    errorSummaryView,
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ email: 'rev@example.com' }) },
    paperId: 'paper_2',
    reviewValidationService: { validate: () => ({ ok: false, errors: { summary: 'required' } }) },
    reviewSubmissionService: { preserveDraft: jest.fn() },
    reviewFormAccessibility,
  });
  controllerValidation.init();
  const validationHandler = formView.onSubmit.mock.calls.at(-1)[0];
  validationHandler({ preventDefault: () => {} });
  expect(validationView.setFieldError).toHaveBeenCalledWith('summary', 'summary required');
  expect(errorSummaryView.setErrors).toHaveBeenCalledWith(['summary']);

  const originalPerformance = global.performance;
  global.performance = undefined;
  const controllerClosed = createReviewSubmissionController({
    formView,
    submissionView,
    validationView: null,
    errorSummaryView: null,
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ email: 'rev@example.com' }) },
    paperId: 'paper_3',
    reviewValidationService: { validate: () => ({ ok: true }) },
    reviewSubmissionService: { submit: () => ({ ok: false, reason: 'closed' }) },
  });
  controllerClosed.init();
  const closedHandler = formView.onSubmit.mock.calls.at(-1)[0];
  closedHandler({ preventDefault: () => {} });
  expect(formView.setViewOnly).toHaveBeenCalledWith(true, 'Review period is closed. View-only access.');
  global.performance = originalPerformance;
});

test('review submission controller handles unauthenticated submit without submission view', () => {
  const formView = {
    isConfirmed: () => true,
    onSubmit: jest.fn(),
    getValues: () => ({ summary: 'ok' }),
    element: document.createElement('form'),
  };

  const controller = createReviewSubmissionController({
    formView,
    submissionView: null,
    validationView: null,
    errorSummaryView: null,
    sessionState: { isAuthenticated: () => false, getCurrentUser: () => null },
    paperId: 'paper_1',
    authController: null,
  });

  controller.init();
  const handler = formView.onSubmit.mock.calls.at(-1)[0];
  handler({ preventDefault: () => {} });
});

test('review submission controller handles duplicate and validation_failed branches', () => {
  const submissionView = { setStatus: jest.fn(), setFinalityMessage: jest.fn(), setNotificationWarning: jest.fn() };
  const formView = {
    isConfirmed: () => true,
    onSubmit: jest.fn(),
    getValues: () => ({ summary: 'ok' }),
    setViewOnly: jest.fn(),
    element: document.createElement('form'),
  };

  const controllerDuplicate = createReviewSubmissionController({
    formView,
    submissionView,
    validationView: null,
    errorSummaryView: null,
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ email: 'rev@example.com' }) },
    paperId: 'paper_dup',
    reviewValidationService: { validate: () => ({ ok: true }) },
    reviewSubmissionService: { submit: () => ({ ok: false, reason: 'duplicate' }) },
  });
  controllerDuplicate.init();
  const dupHandler = formView.onSubmit.mock.calls.at(-1)[0];
  dupHandler({ preventDefault: () => {} });
  expect(submissionView.setFinalityMessage).toHaveBeenCalledWith('This review was already submitted. Submissions are final.');

  const controllerValidationFailed = createReviewSubmissionController({
    formView,
    submissionView,
    validationView: null,
    errorSummaryView: null,
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ email: 'rev@example.com' }) },
    paperId: 'paper_val',
    reviewValidationService: { validate: () => ({ ok: true }) },
    reviewSubmissionService: { submit: () => ({ ok: false, reason: 'validation_failed' }), preserveDraft: jest.fn() },
  });
  controllerValidationFailed.init();
  const valHandler = formView.onSubmit.mock.calls.at(-1)[0];
  valHandler({ preventDefault: () => {} });
  expect(submissionView.setStatus).toHaveBeenCalledWith('Please fix validation errors before submitting.', true);
});

test('review submission controller handles save failure and slow warning', () => {
  const submissionView = { setStatus: jest.fn(), setFinalityMessage: jest.fn(), setNotificationWarning: jest.fn() };
  const formView = {
    isConfirmed: () => true,
    onSubmit: jest.fn(),
    getValues: () => ({ summary: 'ok' }),
    setViewOnly: jest.fn(),
    element: document.createElement('form'),
  };
  const errorLog = { logFailure: jest.fn() };
  const nowSpy = jest.spyOn(global.performance, 'now')
    .mockReturnValueOnce(0)
    .mockReturnValueOnce(100);

  const controller = createReviewSubmissionController({
    formView,
    submissionView,
    validationView: null,
    errorSummaryView: null,
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ email: 'rev@example.com' }) },
    paperId: 'paper_fail',
    reviewValidationService: { validate: () => ({ ok: true }) },
    reviewSubmissionService: { submit: () => ({ ok: false, reason: 'save_failed' }), preserveDraft: jest.fn() },
    errorLog,
  });
  controller.init();
  const handler = formView.onSubmit.mock.calls.at(-1)[0];
  handler({ preventDefault: () => {} });

  expect(submissionView.setStatus).toHaveBeenCalledWith('Review submission failed. Your draft was preserved.', true);
  expect(nowSpy).toHaveBeenCalledTimes(1);
  nowSpy.mockRestore();
});

test('review submit controller blocks non-submitted reviews', () => {
  const controller = createReviewSubmitController({
    review: { status: 'draft', reviewId: 'rev_1' },
    paper: { editorId: 'ed_1' },
    deliveryService: { deliverReview: jest.fn() },
    notificationService: { sendReviewNotifications: jest.fn() },
    auditLogService: { log: jest.fn() },
    adminFlagService: { addFlag: jest.fn() },
  });

  expect(controller.submit()).toEqual({ ok: false, reason: 'not_submitted' });
});

test('review submit controller sends notifications and tolerates audit failures', () => {
  const auditLogService = { log: jest.fn(() => { throw new Error('fail'); }) };
  const controller = createReviewSubmitController({
    review: { status: 'submitted', reviewId: 'rev_1' },
    paper: { editorId: 'ed_1' },
    deliveryService: { deliverReview: jest.fn(() => ({ ok: true })) },
    notificationService: { sendReviewNotifications: jest.fn(() => ({ ok: false })) },
    auditLogService,
    adminFlagService: { addFlag: jest.fn() },
    notificationsEnabled: true,
  });

  const result = controller.submit();
  expect(result.delivery.ok).toBe(true);
  expect(result.notify.ok).toBe(false);
});

test('review submit controller handles missing editor', () => {
  const adminFlagService = { addFlag: jest.fn() };
  const controller = createReviewSubmitController({
    review: { status: 'submitted', reviewId: 'rev_missing' },
    paper: { editorId: null },
    deliveryService: { deliverReview: jest.fn() },
    notificationService: { sendReviewNotifications: jest.fn() },
    auditLogService: { log: jest.fn() },
    adminFlagService,
  });

  const result = controller.submit();
  expect(result).toEqual({ ok: false, reason: 'missing_editor' });
  expect(adminFlagService.addFlag).toHaveBeenCalledWith({ reviewId: 'rev_missing', reason: 'missing_editor' });
});

test('review validation controller handles rules unavailable and validation errors', () => {
  const view = {
    clearErrors: jest.fn(),
    setStatus: jest.fn(),
    getValues: () => ({ summary: '' }),
    setFieldError: jest.fn(),
    onSaveDraft: jest.fn(),
    onSubmitReview: jest.fn(),
    element: document.createElement('form'),
  };
  const summaryView = { clear: jest.fn(), setErrors: jest.fn() };
  const validationRulesService = { getRules: jest.fn(() => ({ ok: false })) };
  const controllerRules = createReviewValidationController({
    view,
    summaryView,
    formId: 'form_1',
    validationRulesService,
    reviewValidationService: { validate: jest.fn() },
    reviewStorageService: { saveDraft: jest.fn(), submitReview: jest.fn() },
  });

  const originalPerformance = global.performance;
  global.performance = undefined;
  controllerRules.init();
  const saveHandler = view.onSaveDraft.mock.calls.at(-1)[0];
  saveHandler({ preventDefault: () => {} });
  expect(view.setStatus).toHaveBeenCalledWith('Validation rules are unavailable. Please try again later.', true);
  global.performance = originalPerformance;

  const validationRulesServiceOk = {
    getRules: () => ({
      ok: true,
      rules: { requiredFields: ['summary'], maxLengths: {}, invalidCharacterPolicy: 'allow_all' },
    }),
  };
  const reviewValidationService = {
    validate: () => ({ ok: false, errors: { summary: 'required' }, messages: { summary: 'Summary required.' } }),
  };
  const reviewValidationAccessibility = { focusFirstError: jest.fn() };
  const controllerValidation = createReviewValidationController({
    view,
    summaryView,
    formId: 'form_2',
    validationRulesService: validationRulesServiceOk,
    reviewValidationService,
    reviewStorageService: { saveDraft: jest.fn(), submitReview: jest.fn() },
    reviewValidationAccessibility,
  });

  controllerValidation.init();
  const submitHandler = view.onSubmitReview.mock.calls.at(-1)[0];
  submitHandler({ preventDefault: () => {} });
  expect(view.setFieldError).toHaveBeenCalledWith('summary', 'Summary required.');
});

test('review validation controller clears view and handles storage failure', () => {
  const view = {
    clearErrors: jest.fn(),
    setStatus: jest.fn(),
    getValues: () => ({ summary: 'Ok' }),
    setFieldError: jest.fn(),
    onSaveDraft: jest.fn(),
    onSubmitReview: jest.fn(),
    element: document.createElement('form'),
  };
  const summaryView = { clear: jest.fn(), setErrors: jest.fn() };
  const errorLog = { logFailure: jest.fn() };
  const validationRulesService = {
    getRules: () => ({ ok: true, rules: { requiredFields: [], maxLengths: {}, invalidCharacterPolicy: 'allow_all' } }),
  };
  const reviewValidationService = { validate: () => ({ ok: true }) };
  const reviewStorageService = { submitReview: () => { throw new Error('store_boom'); }, saveDraft: jest.fn() };

  const controller = createReviewValidationController({
    view,
    summaryView,
    formId: 'form_store',
    validationRulesService,
    reviewValidationService,
    reviewStorageService,
    errorLog,
    reviewValidationAccessibility: null,
  });

  controller.init();
  const submitHandler = view.onSubmitReview.mock.calls.at(-1)[0];
  submitHandler({ preventDefault: () => {} });

  expect(summaryView.clear).toHaveBeenCalled();
  expect(view.clearErrors).toHaveBeenCalled();
  expect(view.setStatus).toHaveBeenCalledWith('We could not save your review. Please try again.', true);
  expect(errorLog.logFailure).toHaveBeenCalledWith(expect.objectContaining({
    message: 'store_boom',
  }));
});

test('review validation controller handles save draft and slow warning', () => {
  const view = {
    clearErrors: jest.fn(),
    setStatus: jest.fn(),
    getValues: () => ({ summary: 'Ok' }),
    setFieldError: jest.fn(),
    onSaveDraft: jest.fn(),
    onSubmitReview: jest.fn(),
    element: document.createElement('form'),
  };
  const summaryView = { clear: jest.fn(), setErrors: jest.fn() };
  const errorLog = { logFailure: jest.fn() };
  const validationRulesService = {
    getRules: () => ({ ok: true, rules: { requiredFields: [], maxLengths: {}, invalidCharacterPolicy: 'allow_all' } }),
  };
  const reviewValidationService = { validate: () => ({ ok: true }) };
  const reviewStorageService = { saveDraft: jest.fn(), submitReview: jest.fn() };
  const nowSpy = jest.spyOn(global.performance, 'now')
    .mockReturnValueOnce(0)
    .mockReturnValue(250);

  const controller = createReviewValidationController({
    view,
    summaryView,
    formId: 'form_draft',
    validationRulesService,
    reviewValidationService,
    reviewStorageService,
    errorLog,
  });

  controller.init();
  const saveHandler = view.onSaveDraft.mock.calls.at(-1)[0];
  saveHandler({ preventDefault: () => {} });

  expect(view.setStatus).toHaveBeenCalledWith('Draft saved successfully.', false);
  expect(errorLog.logFailure).toHaveBeenCalledWith(expect.objectContaining({
    errorType: 'review_validation_slow',
  }));
  nowSpy.mockRestore();
});
