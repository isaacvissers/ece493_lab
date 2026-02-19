import { jest } from '@jest/globals';
import { createAdminNotificationResendController } from '../../src/controllers/admin-notification-resend-controller.js';
import { createEditorReviewAccessController } from '../../src/controllers/editor-review-access-controller.js';
import { createReviewFormController } from '../../src/controllers/review-form-controller.js';
import { createReviewNotificationController } from '../../src/controllers/review-notification-controller.js';
import { createReviewReadinessController } from '../../src/controllers/review-readiness-controller.js';
import { createReviewStatusController } from '../../src/controllers/review-status-controller.js';
import { createReviewSubmissionController } from '../../src/controllers/review-submission-controller.js';
import { createReviewSubmitController } from '../../src/controllers/review-submit-controller.js';
import { createReviewValidationController } from '../../src/controllers/review-validation-controller.js';
import { createReviewWorkflowController } from '../../src/controllers/review-workflow-controller.js';
import { createReviewerAssignmentsController } from '../../src/controllers/reviewer-assignments-controller.js';
import { createReviewerPaperController } from '../../src/controllers/reviewer-paper-controller.js';
import { createRefereeAssignmentController } from '../../src/controllers/referee-assignment-controller.js';
import { authController } from '../../src/controllers/auth-controller.js';

import { createAuditLog } from '../../src/models/audit-log.js';
import { createDeliveryEvent } from '../../src/models/delivery-event.js';
import { createEditor, hasEditorPermission } from '../../src/models/editor.js';
import { createNotification } from '../../src/models/notification.js';
import { createPaper, assignReferees, isEligibleStatus, isPaperAvailable } from '../../src/models/paper.js';
import { createReview, isSubmittedReview } from '../../src/models/review.js';
import { createReviewDraft } from '../../src/models/review-draft.js';
import { createReviewForm, isFormClosed } from '../../src/models/review-form.js';
import { createSubmittedReview, isSubmittedReviewFinal } from '../../src/models/submitted-review.js';
import { createValidationError } from '../../src/models/validation-error.js';
import { createValidationRuleSet, loadValidationRuleSet } from '../../src/models/validation-rule-set.js';
import { createNotificationLog, createNotificationLogEntry } from '../../src/models/notification-log.js';
import { validateManuscript, isManuscriptAvailable } from '../../src/models/manuscript.js';
import { createReadinessAudit } from '../../src/models/readiness-audit.js';
import { createRefereeAssignment, isNonDeclinedRefereeAssignment, validateRefereeEmails } from '../../src/models/referee-assignment.js';
import { createReviewerAssignment, isAcceptedReviewerAssignment } from '../../src/models/reviewer-assignment.js';

import { adminFlagService } from '../../src/services/admin-flag-service.js';
import { assignmentRules } from '../../src/services/assignment-rules.js';
import { assignmentService } from '../../src/services/assignment-service.js';
import { assignmentStorage } from '../../src/services/assignment-storage.js';
import { auditLogService } from '../../src/services/audit-log-service.js';
import { buildReviewFixtures, buildEditorDeliveryFixtures } from '../../src/services/fixtures.js';
import { notificationService } from '../../src/services/notification-service.js';
import { overassignmentAlert } from '../../src/services/overassignment-alert.js';
import { overassignmentCheck } from '../../src/services/overassignment-check.js';
import { readinessAudit } from '../../src/services/readiness-audit.js';
import { refereeAssignmentGuard } from '../../src/services/referee-assignment-guard.js';
import { refereeCount } from '../../src/services/referee-count.js';
import { refereeGuidance } from '../../src/services/referee-guidance.js';
import { refereeInvitationCheck } from '../../src/services/referee-invitation-check.js';
import { refereeReadiness } from '../../src/services/referee-readiness.js';
import { reviewDeliveryService } from '../../src/services/review-delivery-service.js';
import { reviewDraftLoad } from '../../src/services/review-draft-load.js';
import { reviewDraftStore } from '../../src/services/review-draft-store.js';
import { reviewFormAccess } from '../../src/services/review-form-access.js';
import { reviewFormStore } from '../../src/services/review-form-store.js';
import { reviewStatusService } from '../../src/services/review-status-service.js';
import { reviewStorageService } from '../../src/services/review-storage-service.js';
import { reviewSubmissionService } from '../../src/services/review-submission-service.js';
import { reviewValidationService } from '../../src/services/review-validation-service.js';
import { reviewerAssignments } from '../../src/services/reviewer-assignments.js';
import { reviewerBatchAssign } from '../../src/services/reviewer-batch-assign.js';
import { reviewerCount } from '../../src/services/reviewer-count.js';
import { reviewerPaperAccess } from '../../src/services/reviewer-paper-access.js';
import { validationRulesService } from '../../src/services/validation-rules-service.js';
import { errorLog } from '../../src/services/error-log.js';

import { createAdminFlagQueueView } from '../../src/views/admin-flag-queue-view.js';
import { editorAccessibility } from '../../src/views/editor-accessibility.js';
import { createEditorNotificationsView } from '../../src/views/editor-notifications-view.js';
import { createEditorReviewListView } from '../../src/views/editor-review-list-view.js';
import { createRefereeGuidanceView } from '../../src/views/referee-guidance-view.js';
import { createReviewErrorSummaryView } from '../../src/views/review-error-summary-view.js';
import { reviewFormAccessibility } from '../../src/views/review-form-accessibility.js';
import { createReviewFormErrorSummaryView } from '../../src/views/review-form-error-summary-view.js';
import { createReviewFormValidationView } from '../../src/views/review-form-validation-view.js';
import { createReviewFormView } from '../../src/views/review-form-view.js';
import { createReviewReadinessView } from '../../src/views/review-readiness-view.js';
import { createReviewSubmissionView } from '../../src/views/review-submission-view.js';
import { reviewValidationAccessibility } from '../../src/views/review-validation-accessibility.js';
import { createReviewValidationView } from '../../src/views/review-validation-view.js';
import { createReviewerAssignmentsView } from '../../src/views/reviewer-assignments-view.js';
import { createReviewerPaperView } from '../../src/views/reviewer-paper-view.js';

import { createAdminNotificationResendController as createAdminNotificationResendControllerAlias } from '../../src/controllers/adminNotificationResendController.js';
import { createEditorReviewAccessController as createEditorReviewAccessControllerAlias } from '../../src/controllers/editorReviewAccessController.js';
import { createReviewNotificationController as createReviewNotificationControllerAlias } from '../../src/controllers/reviewNotificationController.js';
import { createReviewSubmitController as createReviewSubmitControllerAlias } from '../../src/controllers/reviewSubmitController.js';
import { createReviewValidationController as createReviewValidationControllerAlias } from '../../src/controllers/reviewValidationController.js';
import { createAuditLog as createAuditLogAlias } from '../../src/models/AuditLog.js';
import { createDeliveryEvent as createDeliveryEventAlias } from '../../src/models/DeliveryEvent.js';
import { createEditor as createEditorAlias } from '../../src/models/Editor.js';
import { createNotification as createNotificationAlias } from '../../src/models/Notification.js';
import { createPaper as createPaperAlias } from '../../src/models/Paper.js';
import { createReview as createReviewAlias } from '../../src/models/Review.js';
import { createReviewDraft as createReviewDraftAlias } from '../../src/models/ReviewDraft.js';
import { createReviewForm as createReviewFormAlias } from '../../src/models/ReviewForm.js';
import { createValidationError as createValidationErrorAlias } from '../../src/models/ValidationError.js';
import { createValidationRuleSet as createValidationRuleSetAlias } from '../../src/models/ValidationRuleSet.js';
import { REVIEW_FIELDS } from '../../src/models/reviewConstants.js';
import { FIELD_LABELS } from '../../src/models/validationConstants.js';
import { DELIVERY_STATUS } from '../../src/models/deliveryConstants.js';
import { adminFlagService as adminFlagServiceAlias } from '../../src/services/adminFlagService.js';
import { auditLogService as auditLogServiceAlias } from '../../src/services/auditLogService.js';
import { notificationConfigService } from '../../src/services/notificationConfigService.js';
import { reviewDeliveryService as reviewDeliveryServiceAlias } from '../../src/services/reviewDeliveryService.js';
import { reviewStorageService as reviewStorageServiceAlias } from '../../src/services/reviewStorageService.js';
import { reviewValidationService as reviewValidationServiceAlias } from '../../src/services/reviewValidationService.js';
import { validationRulesService as validationRulesServiceAlias } from '../../src/services/validationRulesService.js';
import { createAdminFlagQueueView as createAdminFlagQueueViewAlias } from '../../src/views/adminFlagQueueView.js';
import { editorAccessibility as editorAccessibilityAlias } from '../../src/views/editorAccessibility.js';
import { createEditorNotificationsView as createEditorNotificationsViewAlias } from '../../src/views/editorNotificationsView.js';
import { createEditorReviewListView as createEditorReviewListViewAlias } from '../../src/views/editorReviewListView.js';
import { createReviewErrorSummaryView as createReviewErrorSummaryViewAlias } from '../../src/views/reviewErrorSummaryView.js';
import { reviewValidationAccessibility as reviewValidationAccessibilityAlias } from '../../src/views/reviewValidationAccessibility.js';
import { createReviewValidationView as createReviewValidationViewAlias } from '../../src/views/reviewValidationView.js';

beforeEach(() => {
  localStorage.clear();
  adminFlagService.reset();
  assignmentStorage.reset();
  auditLogService.reset();
  notificationService.clear();
  reviewDeliveryService.reset();
  reviewDraftStore.reset();
  reviewFormStore.reset();
  reviewStorageService.reset();
  reviewSubmissionService.reset();
  errorLog.clear();
  document.body.innerHTML = '';
});

test('wrapper modules execute', () => {
  expect(createAdminNotificationResendControllerAlias).toBe(createAdminNotificationResendController);
  expect(createEditorReviewAccessControllerAlias).toBe(createEditorReviewAccessController);
  expect(createReviewNotificationControllerAlias).toBe(createReviewNotificationController);
  expect(createReviewSubmitControllerAlias).toBe(createReviewSubmitController);
  expect(createReviewValidationControllerAlias).toBe(createReviewValidationController);
  expect(createAuditLogAlias).toBe(createAuditLog);
  expect(createDeliveryEventAlias).toBe(createDeliveryEvent);
  expect(createEditorAlias).toBe(createEditor);
  expect(createNotificationAlias).toBe(createNotification);
  expect(createPaperAlias).toBe(createPaper);
  expect(createReviewAlias).toBe(createReview);
  expect(createReviewDraftAlias).toBe(createReviewDraft);
  expect(createReviewFormAlias).toBe(createReviewForm);
  expect(createValidationErrorAlias).toBe(createValidationError);
  expect(createValidationRuleSetAlias).toBe(createValidationRuleSet);
  expect(REVIEW_FIELDS.summary).toBe('summary');
  expect(FIELD_LABELS.summary).toBe('Summary');
  expect(DELIVERY_STATUS.delivered).toBe('delivered');
  expect(adminFlagServiceAlias).toBe(adminFlagService);
  expect(auditLogServiceAlias).toBe(auditLogService);
  expect(notificationConfigService).toBeDefined();
  expect(reviewDeliveryServiceAlias).toBe(reviewDeliveryService);
  expect(reviewStorageServiceAlias).toBe(reviewStorageService);
  expect(reviewValidationServiceAlias).toBe(reviewValidationService);
  expect(validationRulesServiceAlias).toBe(validationRulesService);
  expect(createAdminFlagQueueViewAlias).toBe(createAdminFlagQueueView);
  expect(editorAccessibilityAlias).toBe(editorAccessibility);
  expect(createEditorNotificationsViewAlias).toBe(createEditorNotificationsView);
  expect(createEditorReviewListViewAlias).toBe(createEditorReviewListView);
  expect(createReviewErrorSummaryViewAlias).toBe(createReviewErrorSummaryView);
  expect(reviewValidationAccessibilityAlias).toBe(reviewValidationAccessibility);
  expect(createReviewValidationViewAlias).toBe(createReviewValidationView);
});

test('model branches', () => {
  const audit = createAuditLog({ logId: 'log_1', eventType: 'e', relatedId: 'r', createdAt: 'now' });
  expect(audit.logId).toBe('log_1');
  expect(audit.createdAt).toBe('now');

  const delivery = createDeliveryEvent({ deliveryId: 'del_1', reviewId: 'rev', editorId: 'ed', deliveredAt: 'then' });
  expect(delivery.deliveryId).toBe('del_1');
  expect(delivery.deliveredAt).toBe('then');

  const editor = createEditor({ editorId: 'ed_1', permissions: 'bad' });
  expect(editor.permissions).toEqual([]);
  expect(hasEditorPermission(editor, 'review_access')).toBe(false);
  expect(hasEditorPermission({ permissions: ['review_access'] }, 'review_access')).toBe(true);

  const note = createNotification({ notificationId: 'note_1', channels: 'bad', sentAt: 'sent' });
  expect(note.notificationId).toBe('note_1');
  expect(note.channels).toEqual([]);
  expect(note.sentAt).toBe('sent');

  const paper = createPaper({ id: 'p_1', assignedRefereeEmails: 'bad', assignmentVersion: 'nope' });
  expect(paper.paperId).toBe('p_1');
  expect(paper.assignedRefereeEmails).toEqual([]);
  expect(paper.assignmentVersion).toBe(0);
  expect(isEligibleStatus('submitted')).toBe(true);
  expect(isEligibleStatus('eligible')).toBe(true);
  expect(isEligibleStatus('nope')).toBe(false);
  expect(assignReferees({ ...paper, assignmentVersion: 0 }, 'bad').assignmentVersion).toBe(1);
  expect(isPaperAvailable({ status: 'available' })).toBe(true);
  expect(isPaperAvailable({ status: 'withdrawn' })).toBe(false);
  expect(isPaperAvailable(null)).toBe(false);

  const review = createReview({ reviewId: 'rev_1', status: 'submitted' });
  expect(review.reviewId).toBe('rev_1');
  expect(isSubmittedReview(review)).toBe(true);
  expect(isSubmittedReview(null)).toBe(false);

  const draft = createReviewDraft({ draftId: 'draft_1', updatedAt: 'yesterday' });
  expect(draft.draftId).toBe('draft_1');
  expect(draft.updatedAt).toBe('yesterday');

  const form = createReviewForm({ formId: 'form_1', fields: 'bad', requiredFields: 'bad', maxLengths: 'bad' });
  expect(form.formId).toBe('form_1');
  expect(form.fields).toEqual([]);
  expect(form.requiredFields).toEqual([]);
  expect(form.maxLengths).toEqual({});
  expect(isFormClosed({ status: 'closed' })).toBe(true);
  expect(isFormClosed(null)).toBe(false);

  const submitted = createSubmittedReview({ submissionId: 'sub_1', submittedAt: 'now' });
  expect(submitted.submissionId).toBe('sub_1');
  expect(submitted.submittedAt).toBe('now');
  expect(isSubmittedReviewFinal({ status: 'draft' })).toBe(false);

  const validationError = createValidationError({ fieldKey: 'summary', message: 'm', type: 'invalid' });
  expect(validationError.type).toBe('invalid');
  expect(createValidationError().type).toBe('required');

  const ruleSet = createValidationRuleSet({ ruleSetId: 'rs_1', requiredFields: 'bad', maxLengths: 'bad' });
  expect(ruleSet.ruleSetId).toBe('rs_1');
  expect(ruleSet.requiredFields).toEqual([]);
  expect(ruleSet.maxLengths).toEqual({});
  const loaded = loadValidationRuleSet({ requiredFields: ['summary'], allowedCharactersRule: '', maxLengths: { summary: 1 } });
  expect(loaded.invalidCharacterPolicy).toBe('no_control_chars_no_markup');

  const log = createNotificationLog({ notificationId: 'notif_1', createdAt: 't', status: 'sent' });
  expect(log.notificationId).toBe('notif_1');
  expect(log.createdAt).toBe('t');
  expect(createNotificationLogEntry({ attemptedAt: 't2', status: 'sent' }).attemptedAt).toBe('t2');

  const readiness = createReadinessAudit({ auditId: 'a1', timestamp: 't' });
  expect(readiness.auditId).toBe('a1');
  expect(readiness.timestamp).toBe('t');

  const refAssign = createRefereeAssignment({ assignmentId: 'ref_1', createdAt: 't', updatedAt: 'u', refereeEmail: 'TEST@EXAMPLE.COM' });
  expect(refAssign.assignmentId).toBe('ref_1');
  expect(refAssign.refereeEmail).toBe('test@example.com');
  expect(isNonDeclinedRefereeAssignment(null)).toBe(false);

  const reviewerAssign = createReviewerAssignment({ assignmentId: 'ra_1', reviewerEmail: 'TEST@EXAMPLE.COM', status: 'accepted' });
  expect(reviewerAssign.assignmentId).toBe('ra_1');
  expect(isAcceptedReviewerAssignment(reviewerAssign)).toBe(true);
  expect(isAcceptedReviewerAssignment(null)).toBe(false);

  const validations = validateRefereeEmails(['', 'bad', 'test@example.com', 'test@example.com'], ['taken@example.com']);
  expect(validations.ok).toBe(false);
  const okValidations = validateRefereeEmails(['a@example.com', 'b@example.com', 'c@example.com'], []);
  expect(okValidations.ok).toBe(true);
});

test('service branches', () => {
  adminFlagService.addFlag({ reviewId: 'rev', reason: 'missing' });
  const flags = adminFlagService.getFlags();
  adminFlagService.resolveFlag(flags[0].flagId);
  expect(adminFlagService.getFlags()[0].status).toBe('resolved');
  expect(adminFlagService.getFlags()).toHaveLength(1);
  adminFlagService.getFlags();

  auditLogService.log({ eventType: 't', relatedId: 'r' });
  expect(auditLogService.getLogs()).toHaveLength(1);
  auditLogService.getLogs();

  assignmentStorage.seedPaper({ paperId: 'paper_1', status: 'submitted', assignedRefereeEmails: ['a@example.com'], assignmentVersion: 0 });
  const stored = assignmentStorage.getPaper('paper_1');
  expect(stored.id).toBe('paper_1');
  assignmentStorage.updatePaperStatus({ paperId: 'paper_1', status: 'eligible', expectedVersion: 0 });
  expect(() => assignmentStorage.updatePaperStatus({ paperId: 'missing', status: 'eligible' })).toThrow('paper_not_found');
  expect(() => assignmentStorage.saveAssignments({ paperId: 'paper_1', refereeEmails: ['a'], expectedVersion: 2 })).toThrow('concurrent_change');
  assignmentStorage.updatePaperStatus({ paperId: 'paper_1', status: 'withdrawn' });
  expect(() => assignmentStorage.saveAssignments({ paperId: 'paper_1', refereeEmails: ['a'], expectedVersion: stored.assignmentVersion })).toThrow('paper_ineligible');

  const guardOk = refereeAssignmentGuard.canAssign({ paperId: 'paper_1', refereeCount: { getCount: () => 2 } });
  expect(guardOk.ok).toBe(true);
  const guardBlocked = refereeAssignmentGuard.canAssign({ paperId: 'paper_1', refereeCount: { getCount: () => 3 } });
  expect(guardBlocked.ok).toBe(false);

  const refCount = refereeCount.getNonDeclinedEmails({
    paperId: 'paper_1',
    assignmentStorage: { getPaper: () => ({ assignedRefereeEmails: ['A@example.com'] }) },
    reviewRequestStore: {
      getRequests: () => [
        { paperId: 'paper_1', reviewerEmail: 'b@example.com', status: 'sent' },
        { paperId: 'paper_1', reviewerEmail: 'c@example.com', status: 'failed' },
        { paperId: 'paper_2', reviewerEmail: 'd@example.com', status: 'sent' },
      ],
    },
  });
  expect(refCount).toContain('a@example.com');

  expect(refereeGuidance.getGuidance({ count: 'bad' })).toBeNull();
  expect(refereeGuidance.getGuidance({ count: 2 }).action).toBe('add');
  expect(refereeGuidance.getGuidance({ count: 4 }).action).toBe('remove');
  expect(refereeGuidance.getGuidance({ count: 3 })).toBeNull();

  const missing = refereeInvitationCheck.getMissingInvitations({
    paperId: 'paper_1',
    invitationsEnabled: false,
    reviewRequestStore: { getRequests: () => [] },
  });
  expect(missing).toEqual([]);
  const missing2 = refereeInvitationCheck.getMissingInvitations({
    paperId: 'paper_1',
    assignmentStorage: { getPaper: () => ({ assignedRefereeEmails: ['a@example.com'] }) },
    reviewRequestStore: { getRequests: () => [{ paperId: 'paper_1', reviewerEmail: 'a@example.com', status: 'sent' }] },
    refereeCount: { getNonDeclinedEmails: () => ['a@example.com', 'b@example.com'] },
  });
  expect(missing2).toEqual(['b@example.com']);

  const readinessError = refereeReadiness.evaluate({
    paperId: 'paper_1',
    refereeCount: { getCount: () => { throw new Error('fail'); } },
    errorLog: null,
    readinessAudit: null,
  });
  expect(readinessError.ok).toBe(false);
  const readinessReady = refereeReadiness.evaluate({
    paperId: 'paper_1',
    refereeCount: { getCount: () => 3 },
    invitationCheck: null,
  });
  expect(readinessReady.ready).toBe(true);
  const readinessBlocked = refereeReadiness.evaluate({
    paperId: 'paper_1',
    refereeCount: { getCount: () => 5 },
  });
  expect(readinessBlocked.reason).toBe('count_high');

  const reviewForm = createReviewForm({ paperId: 'paper_1', requiredFields: ['summary'] });
  reviewFormStore.saveForm(reviewForm);
  const accessOk = reviewFormAccess.getForm({
    paperId: 'paper_1',
    reviewerEmail: 'rev@example.com',
    assignmentStore: { getAssignments: () => [{ paperId: 'paper_1', reviewerEmail: 'rev@example.com', status: 'accepted' }] },
    reviewDraftStore: { getDraft: () => ({ content: {} }) },
  });
  expect(accessOk.ok).toBe(true);
  const accessUnauthorized = reviewFormAccess.getForm({ paperId: null, reviewerEmail: null });
  expect(accessUnauthorized.reason).toBe('unauthorized');
  const accessNotAccepted = reviewFormAccess.getForm({
    paperId: 'paper_1',
    reviewerEmail: 'rev@example.com',
    assignmentStore: { getAssignments: () => [{ paperId: 'paper_1', reviewerEmail: 'rev@example.com', status: 'pending' }] },
    reviewFormStore: { getForm: () => reviewForm },
    reviewDraftStore: { getDraft: () => null },
  });
  expect(accessNotAccepted.reason).toBe('not_accepted');
  const accessMissingForm = reviewFormAccess.getForm({
    paperId: 'paper_1',
    reviewerEmail: 'rev@example.com',
    assignmentStore: { getAssignments: () => [{ paperId: 'paper_1', reviewerEmail: 'rev@example.com', status: 'accepted' }] },
    reviewFormStore: { getForm: () => null },
    errorLog: null,
  });
  expect(accessMissingForm.reason).toBe('form_missing');

  reviewFormStore.setFailureMode(true);
  expect(() => reviewFormStore.saveForm(reviewForm)).toThrow('form_store_failure');
  reviewFormStore.setFailureMode(false);

  reviewDraftStore.setFailureMode(true);
  expect(() => reviewDraftStore.getDraft('paper', 'rev')).toThrow('draft_store_failure');
  reviewDraftStore.setFailureMode(false);
  reviewDraftStore.saveDraft({ paperId: 'paper', reviewerEmail: 'rev', content: {} });
  expect(reviewDraftStore.getDraft('paper', 'missing')).toBeNull();

  expect(reviewDraftLoad.load({ paperId: 'paper', reviewerEmail: 'rev', reviewDraftStore: { getDraft: () => ({ ok: true }) }, errorLog: null }).ok)
    .toBe(true);

  expect(reviewStatusService.getStatus()).toEqual(reviewSubmissionService.getSubmissionStatus({ paperId: undefined, reviewerEmail: undefined }));

  reviewStorageService.saveDraft({ formId: 'f', reviewerEmail: 'rev', content: {}, errors: { summary: 'required' } });
  reviewStorageService.setFailureMode(true);
  expect(() => reviewStorageService.submitReview({ formId: 'f', reviewerEmail: 'rev', content: {} })).toThrow('review_storage_failure');
  reviewStorageService.setFailureMode(false);

  const valid = reviewValidationService.validate({
    content: { summary: 'Ok', recommendation: 'accept', confidenceRating: 3 },
    requiredFields: ['summary'],
    maxLengths: { summary: 10 },
    invalidCharacterPolicy: 'allow_all',
    action: 'save_draft',
  });
  expect(valid.ok).toBe(true);
  const invalid = reviewValidationService.validate({
    content: { summary: 'Ok', recommendation: 'bad', confidenceRating: 10 },
    requiredFields: ['summary'],
    maxLengths: { summary: 1 },
    invalidCharacterPolicy: 'no_control_chars_no_markup',
    action: 'submit_review',
  });
  expect(invalid.ok).toBe(false);

  const reviewerAssignmentsResult = reviewerAssignments.listAcceptedAssignments({
    reviewerEmail: '',
  });
  expect(reviewerAssignmentsResult.assignments).toHaveLength(0);

  expect(reviewerBatchAssign.split({ reviewerEmails: ['A@EXAMPLE.COM'], currentCount: 2, max: 3 }).allowed).toHaveLength(1);
  reviewerCount.getCountForPaper({ paperId: 'paper', assignmentStore: { getAssignments: () => [{ paperId: 'paper' }, null] } });

  const accessFail = reviewerPaperAccess.getPaperDetails({ reviewerEmail: null, paperId: null });
  expect(accessFail.reason).toBe('invalid_request');

  const rulesMissing = validationRulesService.getRules({ formId: 'missing', reviewFormStore: { getForm: () => null }, errorLog: null });
  expect(rulesMissing.ok).toBe(false);
  const rulesError = validationRulesService.getRules({ formId: 'fail', reviewFormStore: { getForm: () => { throw new Error('boom'); } }, errorLog: null });
  expect(rulesError.ok).toBe(false);

  const alertA = overassignmentAlert.build({ count: 4, blocked: ['a@example.com'], guidanceAction: 'Custom' });
  expect(alertA.message).toContain('Custom');
  const alertB = overassignmentAlert.build({ count: 3 });
  expect(alertB.message).toContain('Over-assignment');

  const checkOk = overassignmentCheck.evaluate({ paperId: 'paper', reviewerCount: { getCountForPaper: () => 2 } });
  expect(checkOk.overassigned).toBe(false);
  const checkFail = overassignmentCheck.evaluate({ paperId: 'paper', reviewerCount: { getCountForPaper: () => { throw new Error(); } }, errorLog: null });
  expect(checkFail.ok).toBe(false);

  const fixtures = buildReviewFixtures();
  expect(fixtures.reviewForm.paperId).toBe('paper_fixture');
  const deliveryFixtures = buildEditorDeliveryFixtures({ paperId: 'p', reviewId: 'r', editorId: 'e' });
  expect(deliveryFixtures.paper.paperId).toBe('p');
});

test('notification service branches', () => {
  notificationService.setNotificationsEnabled(false);
  expect(notificationService.sendReviewNotifications({ reviewId: 'r', editorId: 'e' }).ok).toBe(false);
  notificationService.setNotificationsEnabled(true);
  notificationService.setReviewFailureMode(true);
  notificationService.sendReviewNotifications({ reviewId: 'r', editorId: 'e' });
  notificationService.setReviewFailureMode(false);
  notificationService.sendReviewNotifications({ reviewId: 'r', editorId: 'e' });
  expect(notificationService.getReviewNotificationsByEditor('e')).toHaveLength(2);
  expect(notificationService.shouldBatch()).toBe(false);

  notificationService.setFailureMode(true);
  notificationService.sendNotifications('paper', ['a@example.com']);
  notificationService.setFailureMode(false);
  notificationService.setFailureMode(true);
  notificationService.setRetryFailureMode(true);
  const retry = notificationService.sendNotifications('paper', ['b@example.com']);
  expect(retry.ok).toBe(false);
  notificationService.setRetryFailureMode(false);
  notificationService.setFailureMode(false);
});

test('view branches', () => {
  const adminView = createAdminFlagQueueView();
  adminView.setFlags([{ reviewId: 'rev', reason: 'missing' }], jest.fn());
  adminView.setFlags([]);

  const notesView = createEditorNotificationsView();
  notesView.setNotifications([{ reviewId: 'rev', status: 'sent' }]);
  notesView.setNotifications();

  const listView = createEditorReviewListView();
  listView.setReviews([{ reviewId: 'rev' }]);
  listView.setReviews();

  const guidanceView = createRefereeGuidanceView();
  guidanceView.setGuidance({});
  const handler = jest.fn();
  guidanceView.onAction(handler);
  guidanceView.setGuidance({ message: 'msg', actionLabel: 'Do', action: 'add' });
  guidanceView.element.querySelector('#guidance-action').click();
  expect(handler).toHaveBeenCalledWith('add');

  const summaryContainer = document.createElement('div');
  document.body.appendChild(summaryContainer);
  const summary = createReviewErrorSummaryView(summaryContainer);
  summary.setErrors([]);
  summary.setErrors([{ field: 'summary' }, { message: 'bad' }, {}]);

  const formSummary = createReviewFormErrorSummaryView(summaryContainer);
  formSummary.setErrors([]);
  formSummary.setErrors(['missing']);

  const formView = createReviewFormView();
  formView.setStatus('Ok', false);
  formView.setStatus('Bad', true);
  formView.setForm(null);
  formView.setForm({ paperId: 'paper_1' });
  formView.setDraft({ content: { text: 'Alt', commentsToAuthors: 'c', recommendation: 'accept', confidenceRating: 4 } });
  formView.setViewOnly(true);
  formView.setViewOnly(false);
  formView.onSubmit(() => {});

  const validationView = createReviewFormValidationView(formView.element.querySelector('form'));
  validationView.setFieldError('summary', 'err');
  validationView.setFieldError('summary', '');
  validationView.setFieldError('missing', 'err');
  validationView.clear();

  const readinessView = createReviewReadinessView();
  readinessView.setPaper({ id: 'p', title: 't' });
  readinessView.setPaper(null);
  readinessView.setAuthorizationMessage('auth');
  readinessView.setStatus('Bad', true);
  readinessView.setStatus('Ok', false);
  readinessView.setCount(null);
  readinessView.setCount(3);
  readinessView.setMissingInvitations([]);
  readinessView.setMissingInvitations(['a@example.com']);
  readinessView.setGuidance('guidance');
  readinessView.onStartReview(() => {});

  const submissionView = createReviewSubmissionView();
  submissionView.setStatus('Ok', false);
  submissionView.setStatus('Bad', true);
  submissionView.setFinalityMessage('Final');
  submissionView.setNotificationWarning('Warn');

  const reviewValidationView = createReviewValidationView();
  reviewValidationView.setStatus('Ok', false);
  reviewValidationView.setStatus('Bad', true);
  reviewValidationView.setFieldError('summary', 'bad');
  reviewValidationView.setFieldError('missing', 'bad');
  reviewValidationView.clearErrors();
  reviewValidationView.onSaveDraft(() => {});
  reviewValidationView.onSubmitReview(() => {});

  const reviewerAssignmentsView = createReviewerAssignmentsView();
  reviewerAssignmentsView.setAssignments([]);
  reviewerAssignmentsView.onOpen(() => {});
  reviewerAssignmentsView.setAssignments([{ title: 'Paper', paperId: 'p1' }]);
  reviewerAssignmentsView.setAlert({ message: '' });
  reviewerAssignmentsView.setAlertFailureMode(true);
  reviewerAssignmentsView.setAlert({ message: 'Alert' });
  reviewerAssignmentsView.setAlertFailureMode(false);
  reviewerAssignmentsView.setAlert({ message: 'Alert' });
  reviewerAssignmentsView.setAlertFallback('fallback');

  const paperView = createReviewerPaperView();
  paperView.setPaper(null);
  paperView.setPaper({ id: 'p1', title: '' }, null);
  paperView.setPaper({ id: 'p1', title: 't' }, { file: { originalName: '' } });

  const accessContainer = document.createElement('div');
  accessContainer.innerHTML = '<div id="review-form-error-summary">error</div><div class="error"></div>';
  reviewFormAccessibility.focusFirstError(accessContainer);
  accessContainer.querySelector('#review-form-error-summary').textContent = '';
  reviewFormAccessibility.focusFirstError(accessContainer);
  accessContainer.innerHTML = '';
  reviewFormAccessibility.focusFirstError(accessContainer);

  const validationContainer = document.createElement('div');
  validationContainer.innerHTML = '<div id="review-validation-error-summary">error</div><div class="error"></div>';
  reviewValidationAccessibility.focusFirstError(validationContainer);
  validationContainer.querySelector('#review-validation-error-summary').textContent = '';
  reviewValidationAccessibility.focusFirstError(validationContainer);
  validationContainer.innerHTML = '';
  reviewValidationAccessibility.focusFirstError(validationContainer);

  const editorAccessContainer = document.createElement('div');
  editorAccessContainer.innerHTML = '<a class="item"></a>';
  expect(editorAccessibility.focusFirstItem(editorAccessContainer, '.item')).toBe(true);
  expect(editorAccessibility.focusFirstItem(editorAccessContainer, '.missing')).toBe(false);
});

test('controller branches', () => {
  authController.requestLogin();
  expect(authController.getPending()).toEqual({ destination: undefined, payload: undefined });
  authController.clearPending();

  const editorController = createEditorReviewAccessController();
  expect(editorController.canAccess()).toBe(false);

  const noteController = createReviewNotificationController();
  expect(noteController.send().ok).toBe(true);

  const statusView = { setStatus: jest.fn() };
  const statusController = createReviewStatusController({
    view: statusView,
    sessionState: { getCurrentUser: () => ({ email: 'a' }) },
    paperId: 'paper',
    reviewStatusService: { getStatus: () => ({ ok: true, status: 'submitted' }) },
  });
  statusController.init();
  expect(statusView.setStatus).toHaveBeenCalledWith('Review status: submitted', false);

  const formView = createReviewFormView();
  const formController = createReviewFormController({
    view: formView,
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ email: 'rev@example.com' }) },
    paperId: 'paper',
    reviewFormAccess: { getForm: () => ({ ok: false, reason: 'not_accepted' }) },
    authController: null,
  });
  formController.init();

  const formControllerClosed = createReviewFormController({
    view: formView,
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ email: 'rev@example.com' }) },
    paperId: 'paper',
    reviewFormAccess: { getForm: () => ({ ok: true, form: { paperId: 'paper', status: 'closed' }, draft: { content: {} }, viewOnly: true }) },
  });
  formControllerClosed.init();

  const readinessView = createReviewReadinessView();
  const guidanceView = createRefereeGuidanceView();
  const readinessController = createReviewReadinessController({
    view: readinessView,
    guidanceView,
    assignmentStorage: { getPaper: () => ({ id: 'paper' }) },
    reviewRequestStore: {},
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ role: 'Editor' }) },
    paperId: 'paper',
    readinessService: { evaluate: () => ({ ok: false }) },
    guidanceService: null,
  });
  readinessController.evaluateReadiness();

  const readinessControllerReady = createReviewReadinessController({
    view: readinessView,
    guidanceView,
    assignmentStorage: { getPaper: () => ({ id: 'paper' }) },
    reviewRequestStore: {},
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ role: 'Editor' }) },
    paperId: 'paper',
    readinessService: { evaluate: () => ({ ok: true, ready: true, count: 3, missingInvitations: ['a@example.com'] }) },
    guidanceService: { getGuidance: () => null },
  });
  readinessControllerReady.evaluateReadiness();

  const workflowView = { setStatus: jest.fn(), setPaper: jest.fn(), onStartReview: jest.fn((cb) => cb()) };
  const workflowController = createReviewWorkflowController({
    view: workflowView,
    readinessController: { evaluateReadiness: () => ({ ok: true, ready: true }) },
    assignmentStorage: { getPaper: () => ({ id: 'paper' }), updatePaperStatus: () => {} },
    paperId: 'paper',
  });
  workflowController.init();

  const submitController = createReviewSubmitController({
    review: { status: 'draft', reviewId: 'rev' },
    paper: { editorId: 'ed' },
  });
  expect(submitController.submit().reason).toBe('not_submitted');

  const submitControllerMissing = createReviewSubmitController({
    review: { status: 'submitted', reviewId: 'rev' },
    paper: { editorId: null },
    adminFlagService: { addFlag: jest.fn() },
  });
  expect(submitControllerMissing.submit().reason).toBe('missing_editor');

  const submitControllerNotify = createReviewSubmitController({
    review: { status: 'submitted', reviewId: 'rev' },
    paper: { editorId: 'ed' },
    notificationsEnabled: true,
    auditLogService: { log: () => { throw new Error('fail'); } },
    notificationService: { sendReviewNotifications: () => ({ ok: true }) },
    deliveryService: { deliverReview: () => ({ ok: true }) },
  });
  expect(submitControllerNotify.submit().ok).toBe(true);

  const reviewerAssignmentsView = createReviewerAssignmentsView();
  const assignmentsController = createReviewerAssignmentsController({
    view: reviewerAssignmentsView,
    sessionState: { isAuthenticated: () => false, getCurrentUser: () => null },
    authController: null,
    reviewerAssignments: { listAcceptedAssignments: () => ({ ok: true, assignments: [] }) },
  });
  assignmentsController.refresh();

  const reviewerPaperView = createReviewerPaperView();
  const paperController = createReviewerPaperController({
    view: reviewerPaperView,
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ email: 'rev@example.com' }) },
    reviewerEmail: 'explicit@example.com',
    paperId: 'paper',
    paperAccess: { getPaperDetails: () => ({ ok: false, reason: 'unavailable' }) },
    authController: null,
  });
  paperController.init();

  const adminResendController = createAdminNotificationResendController({
    notificationService: { sendReviewNotifications: () => ({ ok: false }) },
    adminFlagService: { resolveFlag: jest.fn() },
  });
  expect(adminResendController.resend({ reviewId: 'rev', editorId: 'ed', flagId: 'f' }).ok).toBe(false);

  const validationView = createReviewValidationView();
  const errorSummaryView = createReviewErrorSummaryView(validationView.element);
  const validationController = createReviewValidationController({
    view: validationView,
    summaryView: errorSummaryView,
    formId: 'form',
    validationRulesService: { getRules: () => ({ ok: true, rules: { requiredFields: [], maxLengths: {}, invalidCharacterPolicy: 'no_control_chars_no_markup' } }) },
    reviewValidationService: { validate: () => ({ ok: true, errors: {} }) },
    reviewStorageService: { saveDraft: () => ({ ok: true }) },
    reviewSubmissionService: { submitReview: () => ({ ok: true }) },
  });
  validationController.init();
  validationView.element.querySelector('#save-draft').click();

  const refereeView = {
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
  };
  const refereeController = createRefereeAssignmentController({
    view: refereeView,
    assignmentStorage: { getPaper: () => ({ id: 'paper', status: 'submitted', assignedRefereeEmails: [], assignmentVersion: 0 }) },
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ role: 'Editor' }) },
    paperId: 'paper',
    overassignmentCheck: { evaluate: () => ({ ok: true, overassigned: false, count: 1 }) },
    assignmentService: { submitAssignments: () => ({ ok: false }) },
  });
  refereeController.init();
});

test('additional controller branches', () => {
  const defaultResend = createAdminNotificationResendController();
  defaultResend.resend({ reviewId: 'rev', flagId: 'flag' });

  const statusView = { setStatus: jest.fn() };
  createReviewStatusController({
    view: statusView,
    sessionState: { getCurrentUser: () => ({}) },
    paperId: 'paper',
    reviewStatusService: { getStatus: () => ({ ok: false }) },
  }).init();

  const formView = createReviewFormView();
  createReviewFormController({
    view: formView,
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({}) },
    paperId: 'paper',
    reviewFormAccess: { getForm: () => ({ ok: false, reason: 'form_failure' }) },
  }).init();

  const readinessView = createReviewReadinessView();
  const readinessController = createReviewReadinessController({
    view: readinessView,
    guidanceView: null,
    assignmentStorage: { getPaper: () => null },
    reviewRequestStore: {},
    sessionState: { isAuthenticated: () => false, getCurrentUser: () => null },
    paperId: 'paper',
    onAuthRequired: jest.fn(),
  });
  readinessController.evaluateReadiness();

  const workflowView = { setStatus: jest.fn(), setPaper: jest.fn(), onStartReview: jest.fn((cb) => cb()) };
  const workflowControllerMissing = createReviewWorkflowController({
    view: workflowView,
    readinessController: { evaluateReadiness: () => ({ ok: false, ready: false }) },
    assignmentStorage: { getPaper: () => null, updatePaperStatus: () => {} },
    paperId: 'paper',
  });
  workflowControllerMissing.init();

  const assignmentsView = createReviewerAssignmentsView();
  const assignmentsController = createReviewerAssignmentsController({
    view: assignmentsView,
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({}) },
    reviewerAssignments: { listAcceptedAssignments: () => ({ ok: false, assignments: [] }) },
    errorLog: null,
    overassignmentCheck: { evaluate: () => ({ ok: false, overassigned: false }) },
  });
  assignmentsController.refresh();

  const reviewerPaperView = createReviewerPaperView();
  const reviewerController = createReviewerPaperController({
    view: reviewerPaperView,
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({}) },
    paperId: 'paper',
    paperAccess: { getPaperDetails: () => ({ ok: false, reason: 'other' }) },
  });
  reviewerController.init();
});

test('review submission controller branches', () => {
  const formView = createReviewFormView();
  const submissionView = createReviewSubmissionView();
  const validationView = createReviewFormValidationView(formView.element.querySelector('form'));
  const errorSummaryView = createReviewFormErrorSummaryView(formView.element);
  document.body.appendChild(formView.element);
  document.body.appendChild(submissionView.element);

  const authControllerMock = { requestLogin: jest.fn() };
  const controllerAuth = createReviewSubmissionController({
    formView,
    submissionView,
    validationView,
    errorSummaryView,
    sessionState: { isAuthenticated: () => false, getCurrentUser: () => null },
    paperId: 'paper',
    authController: authControllerMock,
  });
  controllerAuth.init();
  formView.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  const controllerConfirm = createReviewSubmissionController({
    formView,
    submissionView,
    validationView,
    errorSummaryView,
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ email: 'rev@example.com' }) },
    paperId: 'paper',
  });
  controllerConfirm.init();
  formView.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  const controllerValidationFail = createReviewSubmissionController({
    formView,
    submissionView,
    validationView,
    errorSummaryView,
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ email: 'rev@example.com' }) },
    paperId: 'paper',
    reviewValidationService: { validate: () => ({ ok: false, errors: { summary: 'required' } }) },
    reviewSubmissionService: { preserveDraft: jest.fn() },
    reviewFormAccessibility: null,
  });
  controllerValidationFail.init();
  formView.element.querySelector('#review-confirm').checked = true;
  formView.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  const makeResultController = (result) => createReviewSubmissionController({
    formView,
    submissionView,
    validationView,
    errorSummaryView,
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ email: 'rev@example.com' }) },
    paperId: 'paper',
    reviewValidationService: { validate: () => ({ ok: true, errors: {} }) },
    reviewSubmissionService: { submit: () => result, preserveDraft: jest.fn() },
  });

  makeResultController({ ok: false, reason: 'duplicate' }).init();
  formView.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  makeResultController({ ok: false, reason: 'closed' }).init();
  formView.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  makeResultController({ ok: false, reason: 'not_assigned' }).init();
  formView.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  makeResultController({ ok: false, reason: 'validation_failed' }).init();
  formView.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  makeResultController({ ok: false, reason: 'save_failed' }).init();
  formView.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  const perfNow = globalThis.performance?.now;
  globalThis.performance = { now: () => 0 };
  const controllerOk = createReviewSubmissionController({
    formView,
    submissionView,
    validationView,
    errorSummaryView,
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ email: 'rev@example.com' }) },
    paperId: 'paper',
    reviewValidationService: { validate: () => ({ ok: true, errors: {} }) },
    reviewSubmissionService: { submit: () => ({ ok: true, notificationStatus: 'failed' }) },
    errorLog: { logFailure: jest.fn() },
  });
  controllerOk.init();
  formView.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  globalThis.performance = perfNow ? { now: perfNow } : undefined;
});

test('review validation controller branches', () => {
  const view = createReviewValidationView();
  const summaryView = createReviewErrorSummaryView(view.element);
  document.body.appendChild(view.element);

  createReviewValidationController({
    view,
    summaryView,
    formId: 'form',
    validationRulesService: { getRules: () => ({ ok: false }) },
  }).init();
  view.element.querySelector('#save-draft').click();

  const controllerInvalid = createReviewValidationController({
    view,
    summaryView,
    formId: 'form',
    validationRulesService: { getRules: () => ({ ok: true, rules: { requiredFields: ['summary'], maxLengths: {}, invalidCharacterPolicy: 'no_control_chars_no_markup' } }) },
    reviewValidationService: { validate: () => ({ ok: false, errors: { summary: 'required' }, messages: {} }) },
    reviewValidationAccessibility: null,
  });
  controllerInvalid.init();
  view.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  const perfNow = globalThis.performance?.now;
  globalThis.performance = { now: () => 0 };
  const controllerSubmit = createReviewValidationController({
    view,
    summaryView,
    formId: 'form',
    reviewStorageService: { submitReview: () => ({ ok: true }) },
    validationRulesService: { getRules: () => ({ ok: true, rules: { requiredFields: [], maxLengths: {}, invalidCharacterPolicy: 'no_control_chars_no_markup' } }) },
    reviewValidationService: { validate: () => ({ ok: true, errors: {} }) },
    errorLog: { logFailure: jest.fn() },
  });
  controllerSubmit.init();
  view.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  globalThis.performance = perfNow ? { now: perfNow } : undefined;
});

test('service edge branches', () => {
  createAuditLog();
  createDeliveryEvent();
  createEditor();
  createNotification();
  createPaper({ paperId: 'p2' });
  createReview();
  createReviewDraft();
  createReviewForm();
  createSubmittedReview();
  createValidationRuleSet();
  createNotificationLog();
  createReadinessAudit();
  createRefereeAssignment();
  createReviewerAssignment();

  adminFlagService.addFlag();
  localStorage.setItem('cms.admin_flags', JSON.stringify([{ flagId: 'x', status: 'open' }]));
  adminFlagService.getFlags();
  adminFlagService.resolveFlag('missing');

  assignmentService.submitAssignments({ paperId: 'paper', reviewerEmails: ['a@example.com'], assignmentGuard: null });

  assignmentStorage.seedPaper({ paperId: 'paper_2', status: 'submitted', assignmentVersion: 0 });
  assignmentStorage.updatePaperStatus({ paperId: 'paper_2', status: 'submitted', expectedVersion: null });

  auditLogService.log();
  localStorage.setItem('cms.audit_log', JSON.stringify([{ logId: 'x' }]));
  auditLogService.getLogs();

  buildReviewFixtures({ paperId: 'custom', reviewForm: { requiredFields: [] } });
  buildEditorDeliveryFixtures({ review: { content: { summary: 'override' } } });

  notificationService.sendReviewNotifications();

  overassignmentAlert.build({ count: 3, blocked: [] });

  overassignmentCheck.evaluate({ paperId: 'paper', reviewerCount: { getCountForPaper: () => { throw new Error(); } } });

  readinessAudit.record({ paperId: 'paper', result: 'ok' });
  readinessAudit.getEntries();
  readinessAudit.clear();

  refereeCount.getNonDeclinedEmails({
    paperId: 'paper',
    assignmentStorage: { getPaper: () => null },
    reviewRequestStore: { getRequests: () => [] },
  });
  refereeGuidance.getGuidance();
  refereeInvitationCheck.getMissingInvitations({
    paperId: 'paper',
    assignmentStorage: { getPaper: () => ({ assignedRefereeEmails: ['a@example.com'] }) },
    reviewRequestStore: {
      getRequests: () => [
        { paperId: 'paper', reviewerEmail: 'a@example.com', decision: 'accepted' },
        { paperId: 'paper', reviewerEmail: 'b@example.com', status: 'failed' },
      ],
    },
  });
  refereeReadiness.evaluate({
    paperId: 'paper',
    refereeCount: { getCount: () => 2 },
    invitationCheck: { getMissingInvitations: () => [] },
  });

  reviewDeliveryService.deliverReview({ reviewId: 'rev', editorId: 'ed' });
  reviewDeliveryService.deliverReview({ reviewId: 'rev', editorId: 'ed' });
  reviewDeliveryService.getEditorReviews('missing');

  reviewDraftLoad.load({ paperId: 'paper', reviewerEmail: 'rev', reviewDraftStore: { getDraft: () => { throw new Error(); } }, errorLog: null });

  reviewDraftStore.getDraft('paper', 'rev');
  reviewFormStore.getForm('missing');

  reviewStorageService.saveDraft({ formId: 'form', reviewerEmail: 'rev', content: {} });
  reviewSubmissionService.submit({
    paperId: 'paper',
    reviewerEmail: 'rev@example.com',
    content: { summary: 'Ok' },
    assignmentStore: { getAssignments: () => [{ paperId: 'paper', reviewerEmail: 'rev@example.com', status: 'pending' }] },
  });
  reviewValidationService.validate({ content: {}, requiredFields: ['summary'], maxLengths: {}, invalidCharacterPolicy: 'no_control_chars_no_markup', action: 'submit_review' });

  reviewerAssignments.listAcceptedAssignments({
    reviewerEmail: 'rev@example.com',
    assignmentStore: { getAssignments: () => [{ paperId: 'p', reviewerEmail: 'rev@example.com', status: 'accepted' }] },
    assignmentStorage: { getPaper: () => null },
    submissionStorage: { getManuscripts: () => [] },
  });
  reviewerBatchAssign.split();
  reviewerCount.getCountForPaper({ paperId: 'paper', assignmentStore: { getAssignments: () => [] } });

  reviewerPaperAccess.getPaperDetails({
    reviewerEmail: 'rev@example.com',
    paperId: 'paper',
    assignmentStore: { getAssignments: () => [{ paperId: 'paper', reviewerEmail: 'rev@example.com', status: 'accepted' }] },
    assignmentStorage: { getPaper: () => ({ id: 'paper', status: 'available', fileStatus: null, file: {} }) },
    submissionStorage: { getManuscripts: () => [{ id: 'paper', file: null }] },
  });

  validationRulesService.getRules({
    formId: 'form',
    reviewFormStore: { getForm: () => ({ requiredFields: [], allowedCharactersRule: 'allow_all', maxLengths: {} }) },
  });
});

test('additional service and model branches', () => {
  const manuscriptInvalid = {
    title: 't',
    authorNames: '   ',
    affiliations: 'a',
    contactEmail: 'bad',
    abstract: 'a',
    keywords: 'k1,',
    mainSource: 'm',
  };
  const manuscriptResult = validateManuscript(manuscriptInvalid);
  expect(manuscriptResult.ok).toBe(false);
  expect(isManuscriptAvailable({ status: 'withdrawn' })).toBe(false);

  createNotificationLogEntry();
  isPaperAvailable({ status: '' });
  createRefereeAssignment({ refereeEmail: 'a@example.com' });
  createReviewForm({ maxLengths: { summary: 10 } });

  adminFlagService.reset();
  localStorage.setItem('cms.admin_flags', JSON.stringify([{ flagId: 'flag_1', status: 'open' }]));
  adminFlagService.getFlags();

  assignmentRules.evaluate({ paperId: 'paper', reviewerEmails: 'bad' });
  assignmentStorage.seedPaper({ paperId: 'paper_2', status: 'submitted', assignmentVersion: 0 });
  assignmentStorage.setFailureMode(true);
  expect(() => assignmentStorage.updatePaperStatus({ paperId: 'paper_2', status: 'submitted' })).toThrow('assignment_storage_failure');
  assignmentStorage.setFailureMode(false);

  auditLogService.setFailureMode(true);
  expect(() => auditLogService.log({ eventType: 'x', relatedId: 'y' })).toThrow('audit_log_failure');
  auditLogService.setFailureMode(false);

  buildEditorDeliveryFixtures();
  overassignmentAlert.build({ count: 4, blocked: ['a'], guidanceAction: null });
  overassignmentCheck.evaluate();
  readinessAudit.record();

  refereeAssignmentGuard.canAssign({ paperId: 'paper', refereeCount: { getCount: () => 5 } });
  refereeCount.getNonDeclinedEmails({
    paperId: 'paper',
    assignmentStorage: { getPaper: () => ({ assignedRefereeEmails: ['a@example.com'] }) },
    reviewRequestStore: {
      getRequests: () => [
        { paperId: 'paper', reviewerEmail: 'b@example.com', status: 'failed' },
        { paperId: 'paper', reviewerEmail: 'c@example.com', decision: 'accepted' },
        { paperId: 'paper', reviewerEmail: 'd@example.com', status: 'sent' },
      ],
    },
  });
  refereeInvitationCheck.getMissingInvitations({
    paperId: 'paper',
    assignmentStorage: { getPaper: () => ({ assignedRefereeEmails: ['a@example.com'] }) },
    reviewRequestStore: { getRequests: () => [] },
    refereeCount: { getNonDeclinedEmails: () => ['a@example.com'] },
  });
  refereeReadiness.evaluate({
    paperId: 'paper',
    refereeCount: { getCount: () => 3 },
    invitationCheck: { getMissingInvitations: () => ['a@example.com'] },
    readinessAudit: null,
    errorLog: null,
  });

  localStorage.setItem('cms.review_delivery_events', JSON.stringify([{ reviewId: 'rev', status: 'delivered' }]));
  localStorage.setItem('cms.editor_review_list', JSON.stringify({ ed: [{ reviewId: 'rev' }] }));
  reviewDeliveryService.reset();
  reviewDeliveryService.deliverReview({ reviewId: 'rev', editorId: 'ed' });
  reviewDeliveryService.getEditorReviews('ed');

  reviewDraftLoad.load({ paperId: 'paper', reviewerEmail: 'rev', reviewDraftStore: { getDraft: () => ({}) } });
  reviewDraftStore.setFailureMode(true);
  expect(() => reviewDraftStore.saveDraft({ paperId: 'paper', reviewerEmail: 'rev', content: {} })).toThrow('draft_store_failure');
  reviewDraftStore.setFailureMode(false);

  reviewFormStore.setFailureMode(true);
  expect(() => reviewFormStore.getForm('paper')).toThrow('form_store_failure');
  reviewFormStore.setFailureMode(false);

  reviewStorageService.setFailureMode(true);
  expect(() => reviewStorageService.saveDraft({ formId: 'f', reviewerEmail: 'r', content: {} })).toThrow('review_storage_failure');
  reviewStorageService.setFailureMode(false);

  reviewSubmissionService.submit({
    paperId: 'paper',
    reviewerEmail: 'rev@example.com',
    content: { summary: 'Ok' },
    assignmentStore: { getAssignments: () => [{ paperId: 'paper', reviewerEmail: 'rev@example.com', status: 'accepted' }] },
    reviewFormStore: { getForm: () => ({ requiredFields: [], status: 'closed' }) },
  });

  reviewValidationService.validate({
    content: { summary: 'Ok', commentsToAuthors: '\u0001', recommendation: 'bad', confidenceRating: 10 },
    requiredFields: [],
    maxLengths: { summary: 1 },
    invalidCharacterPolicy: 'no_control_chars_no_markup',
    action: 'submit_review',
  });

  reviewerAssignments.listAcceptedAssignments({
    reviewerEmail: 'rev@example.com',
    assignmentStore: { getAssignments: () => [{ paperId: 'p', reviewerEmail: 'rev@example.com', status: 'accepted' }] },
    assignmentStorage: { getPaper: () => ({ title: 'Paper' }) },
    submissionStorage: { getManuscripts: () => [{ id: 'p', title: 'Manuscript' }] },
    errorLog: null,
  });
  reviewerCount.getCountForPaper({ paperId: 'paper', assignmentStore: { getAssignments: () => [null] } });

  reviewerPaperAccess.getPaperDetails({
    reviewerEmail: 'rev@example.com',
    paperId: 'paper',
    assignmentStore: { getAssignments: () => [{ paperId: 'paper', reviewerEmail: 'rev@example.com', status: 'accepted' }] },
    assignmentStorage: { getPaper: () => ({ id: 'paper', status: 'available', fileStatus: null, file: {} }) },
    submissionStorage: { getManuscripts: () => [{ id: 'paper', file: { originalName: 'f.pdf' } }] },
    errorLog: null,
  });

  validationRulesService.getRules({
    formId: 'form',
    reviewFormStore: { getForm: () => null },
    errorLog: { logFailure: jest.fn() },
  });
});

test('additional view branches', () => {
  const adminView = createAdminFlagQueueView();
  adminView.setFlags();

  const guidanceView = createRefereeGuidanceView();
  guidanceView.setGuidance();

  const container = document.createElement('div');
  document.body.appendChild(container);
  const errorSummary = createReviewErrorSummaryView(container);
  errorSummary.setErrors();
  const formErrorSummary = createReviewFormErrorSummaryView(container);
  formErrorSummary.setErrors();

  const formView = createReviewFormView();
  formView.setDraft({ content: { summary: 'Summary' } });

  const readinessView = createReviewReadinessView();
  readinessView.setMissingInvitations();

  const submissionView = createReviewSubmissionView();
  submissionView.setStatus();
  submissionView.setFinalityMessage();
  submissionView.setNotificationWarning();

  const validationView = createReviewValidationView();
  validationView.setFieldError('summary');
  validationView.setFieldError('missing');

  const assignmentsView = createReviewerAssignmentsView();
  assignmentsView.setAssignments();
  assignmentsView.setAlert();
});

test('referee assignment controller branches', () => {
  const view = {
    setStatus: jest.fn(),
    setEditable: jest.fn(),
    setPaper: jest.fn(),
    setAuthorizationMessage: jest.fn(),
    setWarning: jest.fn(),
    setSummary: jest.fn(() => true),
    setFallbackSummary: jest.fn(),
    setCountError: jest.fn(),
    setFieldError: jest.fn(),
    clearErrors: jest.fn(),
    getRefereeEmails: () => ['a@example.com'],
    onSubmit: jest.fn(),
  };
  const assignmentStorage = {
    getPaper: () => ({ id: 'paper', status: 'submitted', assignedRefereeEmails: null, assignmentVersion: 0 }),
    saveAssignments: () => ({ id: 'paper', assignedRefereeEmails: [], assignmentVersion: 1 }),
  };
  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage,
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ role: 'Editor' }) },
    paperId: 'paper',
    overassignmentCheck: { evaluate: () => ({ ok: false }) },
    violationLog: null,
  });
  controller.init();
  controller.addReferees(['a@example.com']);
  controller.removeReferees(['a@example.com']);

  const controllerOver = createRefereeAssignmentController({
    view,
    assignmentStorage,
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ role: 'Editor' }) },
    paperId: 'paper',
    overassignmentCheck: { evaluate: () => ({ ok: true, overassigned: true, count: 4 }) },
  });
  controllerOver.init();

  const controllerUnauthorized = createRefereeAssignmentController({
    view,
    assignmentStorage: { getPaper: () => null },
    sessionState: { isAuthenticated: () => false, getCurrentUser: () => null },
    paperId: 'paper',
  });
  controllerUnauthorized.addReferees([]);
  controllerUnauthorized.removeReferees([]);

  const controllerError = createRefereeAssignmentController({
    view,
    assignmentStorage: {
      getPaper: () => ({ id: 'paper', status: 'submitted', assignedRefereeEmails: ['a@example.com'], assignmentVersion: 1 }),
      saveAssignments: () => { throw new Error(); },
    },
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ role: 'Editor' }) },
    paperId: 'paper',
  });
  controllerError.removeReferees(['a@example.com']);
});

test('controller default branches', () => {
  const authControllerMock = { requestLogin: jest.fn() };
  const formController = createReviewFormController({
    view: createReviewFormView(),
    sessionState: { isAuthenticated: () => false, getCurrentUser: () => null },
    paperId: 'paper',
    authController: null,
  });
  formController.init();

  createReviewStatusController({
    view: { setStatus: jest.fn() },
    sessionState: { getCurrentUser: () => null },
    paperId: 'paper',
  }).init();

  const readinessView = createReviewReadinessView();
  const guidanceView = createRefereeGuidanceView();
  const readinessController = createReviewReadinessController({
    view: readinessView,
    guidanceView,
    assignmentStorage: { getPaper: () => ({ id: 'paper' }) },
    reviewRequestStore: {},
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ role: 'Reviewer' }) },
    paperId: 'paper',
    readinessService: { evaluate: () => ({ ok: true, ready: false, count: 2 }) },
    guidanceService: { getGuidance: () => ({ message: 'msg', actionLabel: 'act', action: 'add' }) },
    onGuidanceAction: jest.fn(),
  });
  readinessController.init();
  readinessController.evaluateReadiness();

  const workflowController = createReviewWorkflowController();
  expect(workflowController).toHaveProperty('init');

  const reviewerAssignmentsController = createReviewerAssignmentsController({
    view: { setStatus: jest.fn(), setAssignments: jest.fn(), onRefresh: jest.fn(), onOpen: jest.fn() },
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({}) },
    overassignmentCheck: { evaluate: () => ({ ok: true, overassigned: false }) },
  });
  reviewerAssignmentsController.refresh();

  const reviewerPaperController = createReviewerPaperController({
    view: { setStatus: jest.fn(), setPaper: jest.fn() },
    sessionState: { isAuthenticated: () => false, getCurrentUser: () => null },
    paperId: 'paper',
  });
  reviewerPaperController.init();
});

test('review submission null view branches', () => {
  const formView = createReviewFormView();
  document.body.appendChild(formView.element);
  const controller = createReviewSubmissionController({
    formView,
    submissionView: null,
    validationView: null,
    errorSummaryView: null,
    sessionState: { isAuthenticated: () => false, getCurrentUser: () => null },
    paperId: 'paper',
    reviewValidationService: { validate: () => ({ ok: true, errors: {} }) },
    reviewSubmissionService: { submit: () => ({ ok: true }) },
    reviewFormAccessibility: null,
  });
  controller.init();
  formView.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
});

test('review validation controller null branches', () => {
  const controller = createReviewValidationController();
  expect(controller).toHaveProperty('init');
  const view = createReviewValidationView();
  const controllerSaveFail = createReviewValidationController({
    view,
    summaryView: null,
    formId: 'form',
    reviewStorageService: { saveDraft: () => { throw new Error('fail'); } },
    validationRulesService: { getRules: () => ({ ok: true, rules: { requiredFields: [], maxLengths: {}, invalidCharacterPolicy: 'no_control_chars_no_markup' } }) },
    reviewValidationService: { validate: () => ({ ok: true, errors: {} }) },
    errorLog: null,
    reviewValidationAccessibility: null,
  });
  controllerSaveFail.init();
  view.element.querySelector('#save-draft').click();
});

test('remaining service branches', () => {
  assignmentRules.evaluate({ paperId: 'paper', reviewerEmails: ['a@example.com'] });
  assignmentStorage.seedPaper({ paperId: 'paper_2', status: 'submitted', assignmentVersion: 0 });
  assignmentStorage.updatePaperStatus({ paperId: 'paper_2', status: 'submitted', expectedVersion: 0 });

  localStorage.setItem('cms.audit_log', JSON.stringify([{ logId: 'x' }]));
  auditLogService.getLogs();

  overassignmentAlert.build({ count: 4, blocked: [], guidanceAction: 'Custom' });

  refereeAssignmentGuard.canAssign({ paperId: 'paper', refereeCount: { getCount: () => 1 } });

  refereeCount.getNonDeclinedEmails({
    paperId: 'paper',
    assignmentStorage: { getPaper: () => ({ assignedRefereeEmails: 'bad' }) },
    reviewRequestStore: {
      getRequests: () => [
        { paperId: 'paper', reviewerEmail: 'x@example.com', status: 'failed' },
        { paperId: 'paper', reviewerEmail: 'y@example.com', status: 'sent' },
        { paperId: 'paper', reviewerEmail: 'z@example.com', decision: 'accepted' },
      ],
    },
  });

  refereeInvitationCheck.getMissingInvitations({
    paperId: 'paper',
    assignmentStorage: { getPaper: () => ({ assignedRefereeEmails: ['a@example.com'] }) },
    reviewRequestStore: { getRequests: () => [{ paperId: 'paper', reviewerEmail: 'a@example.com', status: 'failed' }] },
    refereeCount: { getNonDeclinedEmails: () => ['a@example.com'] },
  });

  refereeReadiness.evaluate({
    paperId: 'paper',
    refereeCount: { getCount: () => 4 },
    invitationCheck: null,
  });

  reviewDeliveryService.deliverReview({ reviewId: 'rev2', editorId: 'ed2' });
  reviewDeliveryService.getEditorReviews('missing');

  reviewDraftLoad.load({ paperId: 'paper', reviewerEmail: 'rev', reviewDraftStore: { getDraft: () => { throw new Error('fail'); } } });

  reviewDraftStore.saveDraft({ paperId: 'paper', reviewerEmail: 'rev', content: {} });

  reviewFormStore.saveForm({ paperId: 'paper' });
  reviewFormStore.getForm('paper');

  localStorage.setItem('cms.review_validation_drafts', JSON.stringify([{ formId: 'f' }]));
  reviewStorageService.saveDraft({ formId: 'f', reviewerEmail: 'r', content: {} });

  reviewSubmissionService.submit({
    paperId: 'paper',
    reviewerEmail: 'rev@example.com',
    content: { summary: 'Ok' },
    assignmentStore: { getAssignments: () => [{ paperId: 'paper', reviewerEmail: 'rev@example.com', status: 'accepted' }] },
    reviewFormStore: { getForm: () => ({ requiredFields: [], status: 'active' }) },
    reviewValidationService: { validate: () => ({ ok: true, errors: {} }) },
  });

  reviewValidationService.validate({
    content: { summary: '', recommendation: 'accept', confidenceRating: '' },
    requiredFields: ['summary'],
    maxLengths: {},
    invalidCharacterPolicy: 'allow_all',
    action: 'submit_review',
  });

  reviewerAssignments.listAcceptedAssignments({
    reviewerEmail: 'rev@example.com',
    assignmentStore: { getAssignments: () => { throw new Error('fail'); } },
    errorLog: null,
  });

  reviewerPaperAccess.getPaperDetails({
    reviewerEmail: 'rev@example.com',
    paperId: 'paper',
    assignmentStore: { getAssignments: () => { throw new Error('fail'); } },
    errorLog: null,
  });

  validationRulesService.getRules({
    formId: 'form',
    reviewFormStore: { getForm: () => { throw new Error('fail'); } },
    errorLog: null,
  });
});

test('remaining view branches', () => {
  const assignmentsView = createReviewerAssignmentsView();
  assignmentsView.setAssignments([{ title: '', paperId: 'p1' }]);
  assignmentsView.element.querySelector('button').click();
  assignmentsView.onOpen(() => {});
  assignmentsView.setAlertFallback();

  const formView = createReviewFormView();
  formView.setDraft(null);
});
