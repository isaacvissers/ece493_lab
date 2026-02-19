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
