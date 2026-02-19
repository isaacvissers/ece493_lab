import { jest } from '@jest/globals';

import { createReviewValidationController } from '../../src/controllers/review-validation-controller.js';
import { createReviewSubmissionController } from '../../src/controllers/review-submission-controller.js';
import { createReviewReadinessController } from '../../src/controllers/review-readiness-controller.js';
import { createReviewerAssignmentsController } from '../../src/controllers/reviewer-assignments-controller.js';
import { createReviewerPaperController } from '../../src/controllers/reviewer-paper-controller.js';
import { createReviewFormController } from '../../src/controllers/review-form-controller.js';
import { createReviewStatusController } from '../../src/controllers/review-status-controller.js';
import { createReviewSubmitController } from '../../src/controllers/review-submit-controller.js';
import { createRefereeAssignmentController } from '../../src/controllers/referee-assignment-controller.js';

import { reviewFormAccess } from '../../src/services/review-form-access.js';
import { reviewSubmissionService } from '../../src/services/review-submission-service.js';
import { reviewValidationService } from '../../src/services/review-validation-service.js';
import { validationRulesService } from '../../src/services/validation-rules-service.js';
import { reviewDraftLoad } from '../../src/services/review-draft-load.js';
import { reviewDraftStore } from '../../src/services/review-draft-store.js';
import { reviewFormStore } from '../../src/services/review-form-store.js';
import { reviewStorageService } from '../../src/services/review-storage-service.js';
import { reviewDeliveryService } from '../../src/services/review-delivery-service.js';
import { reviewerAssignments } from '../../src/services/reviewer-assignments.js';
import { reviewerPaperAccess } from '../../src/services/reviewer-paper-access.js';
import { refereeCount } from '../../src/services/referee-count.js';
import { refereeInvitationCheck } from '../../src/services/referee-invitation-check.js';
import { refereeReadiness } from '../../src/services/referee-readiness.js';
import { reviewerCount } from '../../src/services/reviewer-count.js';
import { refereeAssignmentGuard } from '../../src/services/referee-assignment-guard.js';
import { assignmentRules } from '../../src/services/assignment-rules.js';
import { assignmentStorage } from '../../src/services/assignment-storage.js';
import { overassignmentAlert } from '../../src/services/overassignment-alert.js';

import { createReviewValidationView } from '../../src/views/review-validation-view.js';
import { createReviewErrorSummaryView } from '../../src/views/review-error-summary-view.js';
import { createReviewerAssignmentsView } from '../../src/views/reviewer-assignments-view.js';
import { createRefereeGuidanceView } from '../../src/views/referee-guidance-view.js';

import { createReviewFormView } from '../../src/views/review-form-view.js';
import { createReviewSubmissionView } from '../../src/views/review-submission-view.js';
import { createReviewFormValidationView } from '../../src/views/review-form-validation-view.js';
import { createReviewFormErrorSummaryView } from '../../src/views/review-form-error-summary-view.js';

import { createPaper } from '../../src/models/paper.js';
import { createReviewForm } from '../../src/models/review-form.js';
import { createRefereeAssignment } from '../../src/models/referee-assignment.js';
import { validateManuscript, isManuscriptAvailable } from '../../src/models/manuscript.js';

import { adminFlagService } from '../../src/services/admin-flag-service.js';
import { auditLogService } from '../../src/services/audit-log-service.js';
import { notificationService } from '../../src/services/notification-service.js';
import { reviewFormStore as defaultReviewFormStore } from '../../src/services/review-form-store.js';
import { reviewDraftStore as defaultReviewDraftStore } from '../../src/services/review-draft-store.js';
import { errorLog } from '../../src/services/error-log.js';

beforeEach(() => {
  localStorage.clear();
  adminFlagService.reset();
  auditLogService.reset();
  notificationService.clear();
  reviewSubmissionService.reset();
  reviewDraftStore.reset();
  reviewFormStore.reset();
  reviewStorageService.reset();
  reviewDeliveryService.reset();
  assignmentStorage.reset();
  errorLog.clear();
  document.body.innerHTML = '';
});

const makeValidationViewStub = () => ({
  element: document.createElement('div'),
  clearErrors: jest.fn(),
  setStatus: jest.fn(),
  setFieldError: jest.fn(),
  getValues: jest.fn(() => ({ summary: '' })),
  onSaveDraft(handler) {
    this._saveHandler = handler;
  },
  onSubmitReview(handler) {
    this._submitHandler = handler;
  },
});

const makeSummaryViewStub = () => ({
  clear: jest.fn(),
  setErrors: jest.fn(),
});

test('review validation controller covers error, fallback, and timing branches', () => {
  const rulesOk = {
    getRules: () => ({ ok: true, rules: { requiredFields: ['summary', 'customField'], maxLengths: {}, invalidCharacterPolicy: 'no_control_chars_no_markup' } }),
  };

  const viewMissingMessages = makeValidationViewStub();
  const controllerMissingMessages = createReviewValidationController({
    view: viewMissingMessages,
    summaryView: null,
    formId: 'form_1',
    reviewValidationService: { validate: () => ({ ok: false }) },
    validationRulesService: rulesOk,
    reviewValidationAccessibility: null,
  });
  controllerMissingMessages.init();
  viewMissingMessages._saveHandler({ preventDefault: jest.fn() });

  const viewErrors = makeValidationViewStub();
  const summaryView = makeSummaryViewStub();
  const accessibility = { focusFirstError: jest.fn() };
  const controllerErrors = createReviewValidationController({
    view: viewErrors,
    summaryView,
    formId: 'form_2',
    reviewValidationService: {
      validate: () => ({
        ok: false,
        errors: { summary: 'required', customField: 'required' },
        messages: { summary: 'Custom summary message.' },
      }),
    },
    validationRulesService: rulesOk,
    reviewValidationAccessibility: accessibility,
  });
  controllerErrors.init();
  viewErrors._submitHandler({ preventDefault: jest.fn() });
  expect(accessibility.focusFirstError).toHaveBeenCalled();

  const viewStorageFail = makeValidationViewStub();
  const errorLogSpy = { logFailure: jest.fn() };
  const sessionState = { getCurrentUser: () => ({ email: 'rev@example.com' }) };
  const controllerStorageFail = createReviewValidationController({
    view: viewStorageFail,
    summaryView,
    formId: 'form_3',
    sessionState,
    reviewValidationService: { validate: () => ({ ok: true, errors: {} }) },
    validationRulesService: rulesOk,
    reviewStorageService: { saveDraft: () => { throw new Error(''); } },
    errorLog: errorLogSpy,
  });
  controllerStorageFail.init();
  viewStorageFail._saveHandler({ preventDefault: jest.fn() });
  expect(errorLogSpy.logFailure).toHaveBeenCalled();

  const perfSpy = jest.spyOn(globalThis.performance, 'now')
    .mockReturnValueOnce(0)
    .mockReturnValueOnce(250);

  const viewSlow = makeValidationViewStub();
  const slowLog = { logFailure: jest.fn() };
  const controllerSlow = createReviewValidationController({
    view: viewSlow,
    summaryView,
    formId: 'form_4',
    reviewerEmail: 'explicit@example.com',
    reviewValidationService: { validate: () => ({ ok: true, errors: {} }) },
    validationRulesService: rulesOk,
    reviewStorageService: { saveDraft: () => ({ ok: true }), submitReview: () => ({ ok: true }) },
    errorLog: slowLog,
  });
  controllerSlow.init();
  viewSlow._saveHandler({ preventDefault: jest.fn() });
  expect(slowLog.logFailure).toHaveBeenCalled();

  perfSpy.mockRestore();
});

test('review validation controller handles missing view in init and rules unavailable', () => {
  createReviewValidationController().init();

  const view = makeValidationViewStub();
  const controllerRulesMissing = createReviewValidationController({
    view,
    summaryView: null,
    formId: 'form_missing',
    validationRulesService: { getRules: () => ({ ok: false }) },
  });
  controllerRulesMissing.init();
  view._saveHandler({ preventDefault: jest.fn() });
});

test('review validation controller handles session state without email and no performance', () => {
  const perfNow = globalThis.performance;
  globalThis.performance = undefined;

  const view = makeValidationViewStub();
  const storageSpy = { submitReview: jest.fn() };
  const controller = createReviewValidationController({
    view,
    summaryView: makeSummaryViewStub(),
    formId: 'form_5',
    sessionState: { getCurrentUser: () => ({}) },
    reviewValidationService: { validate: () => ({ ok: true, errors: {} }) },
    validationRulesService: { getRules: () => ({ ok: true, rules: { requiredFields: [], maxLengths: {}, invalidCharacterPolicy: 'no_control_chars_no_markup' } }) },
    reviewStorageService: storageSpy,
    errorLog: null,
  });
  controller.init();
  view._submitHandler({ preventDefault: jest.fn() });
  expect(storageSpy.submitReview).toHaveBeenCalled();

  globalThis.performance = perfNow;
});

test('review submission controller covers auth, validation, and timing branches', () => {
  const formView = {
    element: document.createElement('form'),
    onSubmit(handler) { this._handler = handler; },
    isConfirmed: () => true,
    getValues: () => ({ summary: 'Ok' }),
    setViewOnly: jest.fn(),
  };
  const submissionView = {
    setStatus: jest.fn(),
    setFinalityMessage: jest.fn(),
    setNotificationWarning: jest.fn(),
  };

  const controllerAuthFail = createReviewSubmissionController({
    formView,
    submissionView: null,
    validationView: null,
    errorSummaryView: null,
    sessionState: { isAuthenticated: () => false, getCurrentUser: () => null },
    paperId: 'paper_auth',
    authController: null,
  });
  controllerAuthFail.init();
  formView._handler({ preventDefault: jest.fn() });

  const controllerValidationFail = createReviewSubmissionController({
    formView,
    submissionView,
    validationView: null,
    errorSummaryView: null,
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({}) },
    paperId: 'paper_validation',
    reviewValidationService: { validate: () => ({ ok: false, errors: { summary: 'required' } }) },
    reviewSubmissionService: { preserveDraft: jest.fn() },
    reviewFormAccessibility: null,
  });
  controllerValidationFail.init();
  formView._handler({ preventDefault: jest.fn() });

  const perfSpy = jest.spyOn(globalThis.performance, 'now')
    .mockReturnValueOnce(0)
    .mockReturnValueOnce(75);

  const slowLog = { logFailure: jest.fn() };
  const controllerSlow = createReviewSubmissionController({
    formView,
    submissionView,
    validationView: null,
    errorSummaryView: null,
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ email: 'rev@example.com' }) },
    paperId: 'paper_slow',
    reviewValidationService: { validate: () => ({ ok: true, errors: {} }) },
    reviewSubmissionService: { submit: () => ({ ok: true, notificationStatus: 'failed' }) },
    errorLog: slowLog,
  });
  controllerSlow.init();
  formView._handler({ preventDefault: jest.fn() });
  expect(slowLog.logFailure).toHaveBeenCalled();

  perfSpy.mockRestore();
});

test('review submission controller handles confirm, closed, and init without form view', () => {
  const formView = {
    element: document.createElement('form'),
    onSubmit: (handler) => { formView._handler = handler; },
    isConfirmed: () => false,
    getValues: () => ({ summary: 'Ok' }),
    setViewOnly: jest.fn(),
  };
  const submissionView = { setStatus: jest.fn(), setFinalityMessage: jest.fn(), setNotificationWarning: jest.fn() };

  const controllerConfirm = createReviewSubmissionController({
    formView,
    submissionView,
    validationView: null,
    errorSummaryView: null,
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ email: 'rev@example.com' }) },
    paperId: 'paper_confirm',
  });
  controllerConfirm.init();
  formView._handler({ preventDefault: jest.fn() });

  const controllerClosed = createReviewSubmissionController({
    formView,
    submissionView,
    validationView: null,
    errorSummaryView: null,
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ email: 'rev@example.com' }) },
    paperId: 'paper_closed',
    reviewValidationService: { validate: () => ({ ok: true, errors: {} }) },
    reviewSubmissionService: { submit: () => ({ ok: false, reason: 'closed' }), preserveDraft: jest.fn() },
  });
  controllerClosed.init();
  formView._handler({ preventDefault: jest.fn() });

  const controllerNoForm = createReviewSubmissionController({
    formView: null,
    submissionView,
    validationView: null,
    errorSummaryView: null,
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ email: 'rev@example.com' }) },
    paperId: 'paper_none',
  });
  controllerNoForm.init();
});

test('review submission controller handles missing performance timing', () => {
  const perfNow = globalThis.performance;
  globalThis.performance = undefined;

  const formView = {
    element: document.createElement('form'),
    onSubmit(handler) { this._handler = handler; },
    isConfirmed: () => true,
    getValues: () => ({ summary: 'Ok' }),
    setViewOnly: jest.fn(),
  };
  const submissionView = { setStatus: jest.fn(), setFinalityMessage: jest.fn(), setNotificationWarning: jest.fn() };

  const controller = createReviewSubmissionController({
    formView,
    submissionView,
    validationView: null,
    errorSummaryView: null,
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ email: 'rev@example.com' }) },
    paperId: 'paper_perf',
    reviewValidationService: { validate: () => ({ ok: true, errors: {} }) },
    reviewSubmissionService: { submit: () => ({ ok: true }) },
    errorLog: null,
  });
  controller.init();
  formView._handler({ preventDefault: jest.fn() });

  globalThis.performance = perfNow;
});

test('review form access covers error paths and email normalization', () => {
  const errorLogSpy = { logFailure: jest.fn() };
  const failingAssignments = { getAssignments: () => { throw new Error('lookup_failed'); } };
  const result = reviewFormAccess.getForm({
    paperId: 'paper',
    reviewerEmail: 'USER@EXAMPLE.COM',
    assignmentStore: failingAssignments,
    errorLog: errorLogSpy,
  });
  expect(result.reason).toBe('assignment_lookup_failed');

  reviewFormAccess.getForm({
    paperId: 'paper',
    reviewerEmail: 'user@example.com',
  });

  const resultNoLog = reviewFormAccess.getForm({
    paperId: 'paper',
    reviewerEmail: 'USER@EXAMPLE.COM',
    assignmentStore: failingAssignments,
    errorLog: null,
  });
  expect(resultNoLog.ok).toBe(false);

  const failingFormStore = { getForm: () => { throw new Error(); } };
  const resultFormFail = reviewFormAccess.getForm({
    paperId: 'paper',
    reviewerEmail: 'user@example.com',
    assignmentStore: { getAssignments: () => [{ paperId: 'paper', reviewerEmail: 'user@example.com', status: 'accepted' }] },
    reviewFormStore: failingFormStore,
    errorLog: errorLogSpy,
  });
  expect(resultFormFail.reason).toBe('form_failure');

  const failingDraftStore = { getDraft: () => { throw new Error(); } };
  const resultDraftFail = reviewFormAccess.getForm({
    paperId: 'paper',
    reviewerEmail: 'user@example.com',
    assignmentStore: { getAssignments: () => [{ paperId: 'paper', reviewerEmail: 'user@example.com', status: 'accepted' }] },
    reviewFormStore: { getForm: () => ({ paperId: 'paper', status: 'active' }) },
    reviewDraftStore: failingDraftStore,
    errorLog: errorLogSpy,
  });
  expect(resultDraftFail.reason).toBe('draft_failure');

  reviewFormAccess.getForm({
    paperId: 'paper',
    reviewerEmail: 'user@example.com',
    assignmentStore: { getAssignments: () => [{ paperId: 'paper', reviewerEmail: 'user@example.com', status: 'accepted' }] },
    reviewFormStore: { getForm: () => null },
    reviewDraftStore: { getDraft: () => null },
    errorLog: null,
  });
});

test('review submission service covers cache, defaults, and error branches', () => {
  reviewSubmissionService.reset();
  reviewSubmissionService.getSubmissionStatus();

  localStorage.setItem('cms.submitted_reviews', JSON.stringify([{ paperId: 'p1', reviewerEmail: 'r1' }]));
  reviewSubmissionService.getSubmissionStatus({ paperId: 'p1', reviewerEmail: 'r1' });

  reviewSubmissionService.submit();
  reviewSubmissionService.preserveDraft();

  const originalSetItem = localStorage.setItem;
  localStorage.setItem = () => { throw {}; };
  reviewSubmissionService.submit({
    paperId: 'paper',
    reviewerEmail: 'rev@example.com',
    content: { summary: 'Ok' },
    assignmentStore: { getAssignments: () => [{ paperId: 'paper', reviewerEmail: 'rev@example.com', status: 'accepted' }] },
    reviewFormStore: { getForm: () => ({ requiredFields: [], status: 'active' }) },
    reviewValidationService: { validate: () => ({ ok: true, errors: {} }) },
    errorLog: { logFailure: jest.fn() },
  });
  localStorage.setItem = originalSetItem;

  const errorLogSpy = { logFailure: jest.fn() };
  localStorage.setItem = () => { throw {}; };
  reviewSubmissionService.submit({
    paperId: 'paper',
    reviewerEmail: 'rev@example.com',
    content: { summary: 'Ok' },
    assignmentStore: { getAssignments: () => [{ paperId: 'paper', reviewerEmail: 'rev@example.com', status: 'accepted' }] },
    reviewFormStore: { getForm: () => ({ requiredFields: [], status: 'active' }) },
    reviewValidationService: { validate: () => ({ ok: true, errors: {} }) },
    errorLog: errorLogSpy,
  });
  localStorage.setItem = originalSetItem;

  reviewSubmissionService.submit({
    paperId: 'paper',
    reviewerEmail: 'rev@example.com',
    content: { summary: 'Ok' },
    notificationsEnabled: true,
    assignmentStore: { getAssignments: () => [{ paperId: 'paper', reviewerEmail: 'rev@example.com', status: 'accepted' }] },
    reviewFormStore: { getForm: () => ({ requiredFields: [], status: 'active' }) },
    reviewValidationService: { validate: () => ({ ok: true, errors: {} }) },
    errorLog: null,
  });

  reviewSubmissionService.submit({
    paperId: 'paper',
    reviewerEmail: 'rev@example.com',
    content: { summary: 'Ok' },
    notificationsEnabled: true,
    assignmentStore: { getAssignments: () => [{ paperId: 'paper', reviewerEmail: 'rev@example.com', status: 'accepted' }] },
    reviewFormStore: { getForm: () => ({ requiredFields: [], status: 'active' }) },
    reviewValidationService: { validate: () => ({ ok: true, errors: {} }) },
    errorLog: null,
  });

  reviewSubmissionService.preserveDraft({
    paperId: 'paper',
    reviewerEmail: 'rev@example.com',
    content: {},
    reviewDraftStore: { saveDraft: () => { throw {}; } },
  });
});

test('review validation service covers default args and fallback labels', async () => {
  reviewValidationService.validate();

  const { reviewValidationService: mockedValidation } = await import('../../src/services/review-validation-service.js');
  mockedValidation.validate({
    content: { customField: '' },
    requiredFields: 'bad',
    maxLengths: {},
    invalidCharacterPolicy: 'allow_all',
    action: 'submit_review',
  });

  const { reviewValidationService: mockWithCustomFields } = await (async () => {
    jest.resetModules();
    jest.unstable_mockModule('../../src/models/validation-constants.js', () => ({
      REQUIRED_REVIEW_FIELDS: ['summary'],
      RECOMMENDATION_OPTIONS: ['accept'],
      CONFIDENCE_RANGE: { min: 1, max: 5 },
      REVIEW_FIELDS: { recommendation: 'recommendation', confidence: 'confidenceRating' },
      INVALID_CHAR_PATTERN: /[<>]/,
      TEXT_VALIDATION_FIELDS: ['custom_text'],
      VALIDATION_TYPES: {
        required: 'required',
        invalidChars: 'invalid_chars',
        maxLength: 'max_length',
        invalidOption: 'invalid_option',
        outOfRange: 'out_of_range',
      },
      FIELD_LABELS: {},
    }));
    return import('../../src/services/review-validation-service.js');
  })();

  mockWithCustomFields.validate({
    content: { custom_text: '<bad>' },
    requiredFields: [],
    maxLengths: { custom_text: 1 },
    invalidCharacterPolicy: 'no_control_chars_no_markup',
    action: 'submit_review',
  });
});

test('validation rules service covers missing rules and error branches', () => {
  const errorLogSpy = { logFailure: jest.fn() };
  const resultMissing = validationRulesService.getRules({
    formId: 'missing',
    reviewFormStore: { getForm: () => null },
    errorLog: errorLogSpy,
  });
  expect(resultMissing.ok).toBe(false);

  const resultError = validationRulesService.getRules({
    formId: 'error',
    reviewFormStore: { getForm: () => { throw new Error('boom'); } },
    errorLog: null,
  });
  expect(resultError.ok).toBe(false);

  validationRulesService.getRules({ formId: 'default' });
});

test('review draft load/store and form store cover fallback branches', () => {
  reviewDraftLoad.load();
  reviewDraftStore.getDraft('paper', 'rev');
  reviewDraftStore.saveDraft({ paperId: 'paper', reviewerEmail: 'rev', content: {} });

  localStorage.setItem('cms.review_drafts', JSON.stringify({ 'paper::rev': { content: {} } }));
  reviewDraftStore.getDraft('paper', 'rev');

  reviewFormStore.saveForm({ paperId: 'paper' });
  reviewFormStore.getForm('paper');
  localStorage.setItem('cms.review_forms', JSON.stringify([{ paperId: 'paper' }]));
  reviewFormStore.getForm('paper');
});

test('review storage service covers default args', () => {
  reviewStorageService.saveDraft();
  reviewStorageService.submitReview();
});

test('review delivery service covers missing target and cache branches', () => {
  reviewDeliveryService.deliverReview();
  reviewDeliveryService.getEditorReviews('missing');

  reviewDeliveryService.deliverReview({ reviewId: 'rev', editorId: 'ed' });
  reviewDeliveryService.deliverReview({ reviewId: 'rev', editorId: 'ed' });

  localStorage.setItem('cms.review_delivery_events', JSON.stringify([{ reviewId: 'rev2', status: 'delivered' }]));
  localStorage.setItem('cms.editor_review_list', JSON.stringify({ ed: [{ reviewId: 'rev2' }] }));
  reviewDeliveryService.reset();
  reviewDeliveryService.getEditorReviews('ed');
});

test('reviewer assignments and paper access cover fallback branches', () => {
  reviewerAssignments.listAcceptedAssignments({ reviewerEmail: '' });
  reviewerAssignments.listAcceptedAssignments({
    reviewerEmail: 'rev@example.com',
    assignmentStore: { getAssignments: () => [{ paperId: 'p1', reviewerEmail: 'rev@example.com', status: 'accepted' }] },
    assignmentStorage: { getPaper: () => null },
    submissionStorage: { getManuscripts: () => [] },
  });
  reviewerAssignments.listAcceptedAssignments({
    reviewerEmail: 'rev@example.com',
    assignmentStore: { getAssignments: () => [{ paperId: 'p1', reviewerEmail: 'rev@example.com', status: 'accepted' }] },
    assignmentStorage: { getPaper: () => ({ title: '' }) },
    submissionStorage: { getManuscripts: () => [{ id: 'p1', title: '' }] },
  });

  reviewerPaperAccess.getPaperDetails({ reviewerEmail: null, paperId: null });
  reviewerPaperAccess.getPaperDetails({
    reviewerEmail: 'rev@example.com',
    paperId: 'paper',
    assignmentStore: { getAssignments: () => { throw new Error(); } },
    errorLog: null,
  });

  reviewerPaperAccess.getPaperDetails({
    reviewerEmail: 'rev@example.com',
    paperId: 'paper',
    assignmentStore: { getAssignments: () => [{ paperId: 'paper', reviewerEmail: 'rev@example.com', status: 'accepted' }] },
    assignmentStorage: { getPaper: () => ({ id: 'paper', status: 'available', fileStatus: null, file: {} }) },
    submissionStorage: { getManuscripts: () => [{ id: 'paper', file: null, status: 'submitted' }] },
  });

  reviewerPaperAccess.getPaperDetails({
    reviewerEmail: 'rev@example.com',
    paperId: 'paper',
    assignmentStore: { getAssignments: () => [{ paperId: 'paper', reviewerEmail: 'rev@example.com', status: 'accepted' }] },
    assignmentStorage: { getPaper: () => ({ id: 'paper', status: 'available', fileStatus: null, file: {} }) },
    submissionStorage: { getManuscripts: () => [{ id: 'paper', file: { originalName: 'file.pdf' }, status: 'submitted' }] },
  });
});

test('referee counts and invitation checks cover default branches', () => {
  refereeCount.getNonDeclinedEmails();
  refereeCount.getCount();

  const invitationsDisabled = refereeInvitationCheck.getMissingInvitations({
    paperId: 'paper',
    invitationsEnabled: false,
  });
  expect(invitationsDisabled).toEqual([]);

  refereeInvitationCheck.getMissingInvitations({
    paperId: 'paper',
    assignmentStorage: { getPaper: () => ({ assignedRefereeEmails: ['a@example.com'] }) },
    reviewRequestStore: { getRequests: () => [{ paperId: 'paper', reviewerEmail: 'a@example.com', status: 'sent' }] },
    refereeCount: { getNonDeclinedEmails: () => ['a@example.com', 'b@example.com'] },
  });
});

test('referee readiness covers invitation and audit branches', () => {
  refereeReadiness.evaluate({
    paperId: 'paper',
    refereeCount: { getCount: () => 3 },
    invitationCheck: null,
    readinessAudit: null,
    errorLog: null,
  });

  refereeReadiness.evaluate({
    paperId: 'paper',
    refereeCount: { getCount: () => 2 },
    invitationCheck: { getMissingInvitations: () => [] },
    readinessAudit: null,
    errorLog: null,
  });
});

test('reviewer count, guard, and assignment rules cover default branches', () => {
  reviewerCount.getCountForPaper({ paperId: 'paper', assignmentStore: { getAssignments: () => [] } });
  reviewerCount.getCountForPaper();

  refereeAssignmentGuard.canAssign({
    paperId: 'paper',
    refereeCount: { getCount: () => 4 },
  });
  refereeAssignmentGuard.canAssign();

  assignmentRules.evaluate({
    paperId: 'paper',
    reviewerEmails: ['bad'],
    assignmentStore: {
      hasActiveAssignment: () => false,
      getActiveCountForReviewer: () => 0,
    },
  });

  assignmentStorage.seedPaper({ paperId: 'paper', status: 'submitted', assignmentVersion: 0 });
  assignmentStorage.updatePaperStatus({ paperId: 'paper', status: 'eligible', expectedVersion: null });
});

test('overassignment alert and referee guidance view cover fallback branches', () => {
  overassignmentAlert.build({ count: 3 });

  const guidanceView = createRefereeGuidanceView();
  guidanceView.onAction(jest.fn());
  guidanceView.setGuidance({ message: 'msg', actionLabel: '', action: null });
  guidanceView.element.querySelector('#guidance-action').click();
});

test('reviewer assignments view covers alert and open handler branches', () => {
  const view = createReviewerAssignmentsView();
  view.setAlertFailureMode(true);
  view.setAlert({ message: 'Alert' });
  view.setAlertFailureMode(false);
  view.setAlert({ message: '' });
  view.setAssignments([{ title: 'Paper', paperId: 'p1' }]);
  view.element.querySelector('button').click();
  view.onOpen(() => {});
  view.element.querySelector('button').click();
});

test('controllers with default services cover default-arg branches', () => {
  const reviewFormView = createReviewFormView();
  const sessionState = { isAuthenticated: () => false, getCurrentUser: () => null };
  createReviewFormController({ view: reviewFormView, sessionState, paperId: 'paper' }).init();

  const statusView = { setStatus: jest.fn() };
  createReviewStatusController({ view: statusView, sessionState: { getCurrentUser: () => null }, paperId: 'paper' }).init();

  createReviewSubmitController({ review: null, paper: null }).submit();

  const readinessView = { setStatus: jest.fn(), setMissingInvitations: jest.fn(), setGuidance: jest.fn(), setPaper: jest.fn(), setAuthorizationMessage: jest.fn(), setCount: jest.fn() };
  createReviewReadinessController({
    view: readinessView,
    guidanceView: null,
    assignmentStorage: { getPaper: () => null },
    reviewRequestStore: {},
    sessionState: { isAuthenticated: () => false, getCurrentUser: () => null },
    paperId: 'paper',
    onAuthRequired: jest.fn(),
  }).evaluateReadiness();

  const assignmentsView = createReviewerAssignmentsView();
  createReviewerAssignmentsController({
    view: assignmentsView,
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ email: 'rev@example.com' }) },
    reviewerAssignments: { listAcceptedAssignments: () => ({ ok: true, assignments: [] }) },
    overassignmentCheck: { evaluate: () => ({ ok: false }) },
    errorLog: null,
  }).refresh();

  const reviewerPaperView = { setStatus: jest.fn(), setPaper: jest.fn() };
  createReviewerPaperController({
    view: reviewerPaperView,
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ email: 'rev@example.com' }) },
    reviewerEmail: null,
    paperId: 'paper',
    paperAccess: { getPaperDetails: () => ({ ok: false, reason: 'other' }) },
    authController: null,
  }).init();
});

test('review readiness controller covers auth, paper missing, and guidance branches', () => {
  const view = {
    setStatus: jest.fn(),
    setMissingInvitations: jest.fn(),
    setGuidance: jest.fn(),
    setPaper: jest.fn(),
    setAuthorizationMessage: jest.fn(),
    setCount: jest.fn(),
  };
  const guidanceView = { setGuidance: jest.fn(), onAction: jest.fn() };

  const controllerNoRole = createReviewReadinessController({
    view,
    guidanceView: null,
    assignmentStorage: { getPaper: () => ({ id: 'paper' }) },
    reviewRequestStore: {},
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({}) },
    paperId: 'paper',
  });
  controllerNoRole.evaluateReadiness();

  const controllerNoPaper = createReviewReadinessController({
    view,
    guidanceView,
    assignmentStorage: { getPaper: () => null },
    reviewRequestStore: {},
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ role: 'Editor' }) },
    paperId: 'paper',
  });
  controllerNoPaper.evaluateReadiness();

  const controllerGuidance = createReviewReadinessController({
    view,
    guidanceView,
    assignmentStorage: { getPaper: () => ({ id: 'paper' }) },
    reviewRequestStore: {},
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ role: 'Editor' }) },
    paperId: 'paper',
    readinessService: { evaluate: () => ({ ok: true, ready: false, count: 2, missingInvitations: [] }) },
    guidanceService: { getGuidance: () => ({ message: 'msg', actionLabel: 'act', action: 'add' }) },
  });
  controllerGuidance.evaluateReadiness();
});

test('reviewer assignments controller covers alert and open branches', () => {
  const view = {
    setStatus: jest.fn(),
    setAssignments: jest.fn(),
    setAlert: jest.fn(() => false),
    setAlertFallback: jest.fn(),
    onRefresh: jest.fn(),
    onOpen: jest.fn(),
  };
  const assignments = [{ paperId: 'p1' }, null, { paperId: 'p1' }];

  const controller = createReviewerAssignmentsController({
    view,
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ email: 'rev@example.com' }) },
    reviewerAssignments: { listAcceptedAssignments: () => ({ ok: true, assignments }) },
    overassignmentCheck: { evaluate: () => ({ ok: true, overassigned: true, count: 4 }) },
    errorLog: null,
  });
  controller.refresh();

  const controllerOpen = createReviewerAssignmentsController({
    view,
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ email: 'rev@example.com' }) },
    reviewerAssignments: { listAcceptedAssignments: () => ({ ok: true, assignments: [] }) },
    onOpenPaper: jest.fn(),
  });
  controllerOpen.init();
  const onOpenHandler = view.onOpen.mock.calls[0][0];
  onOpenHandler({ paperId: 'p1' });
});

test('referee assignment controller covers missing summary and update failure branches', () => {
  const view = {
    setStatus: jest.fn(),
    setEditable: jest.fn(),
    setPaper: jest.fn(),
    setAuthorizationMessage: jest.fn(),
    setWarning: jest.fn(),
    setSummary: jest.fn(() => false),
    setFallbackSummary: jest.fn(),
    setCountError: jest.fn(),
    setFieldError: jest.fn(),
    clearErrors: jest.fn(),
    getRefereeEmails: () => ['a@example.com'],
    onSubmit: jest.fn(),
    showConfirmation: jest.fn(),
  };

  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage: {
      getPaper: () => ({ id: 'paper', status: 'submitted', assignedRefereeEmails: [], assignmentVersion: 0 }),
      saveAssignments: () => { throw new Error(); },
    },
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ role: 'Editor' }) },
    paperId: 'paper',
    overassignmentCheck: { evaluate: () => ({ ok: false }) },
    violationLog: null,
  });
  controller.init();
  controller.removeReferees(['a@example.com']);
});

test('reviewer paper controller covers auth and default branches', () => {
  const view = { setStatus: jest.fn(), setPaper: jest.fn() };
  createReviewerPaperController({
    view,
    sessionState: { isAuthenticated: () => false, getCurrentUser: () => null },
    paperId: 'paper',
    authController: null,
  }).init();
});

test('manuscript availability covers removed and missing file branches', () => {
  const manuscript = validateManuscript({
    title: 't',
    authorNames: 'a',
    affiliations: 'a',
    contactEmail: 'a@example.com',
    abstract: 'a',
    keywords: 'k',
    mainSource: 'm',
  });
  expect(manuscript.ok).toBe(true);

  expect(isManuscriptAvailable({ status: 'removed', file: {} })).toBe(false);
  expect(isManuscriptAvailable({ status: 'submitted', fileStatus: 'missing', file: {} })).toBe(false);
});

test('model defaults cover fallback branches', () => {
  createPaper({ id: null, paperId: null, assignedRefereeEmails: 'bad', assignmentVersion: 'nope' });
  createReviewForm({ maxLengths: null });
  createRefereeAssignment({ refereeEmail: 'a@example.com', createdAt: null, updatedAt: null });
});
