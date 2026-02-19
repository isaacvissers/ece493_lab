import {
  createAuditLog,
  __auditLogModule,
} from '../../src/models/AuditLog.js';
import {
  createDeliveryEvent,
  __deliveryEventModule,
} from '../../src/models/DeliveryEvent.js';
import {
  createEditor,
  hasEditorPermission,
  __editorModule,
} from '../../src/models/Editor.js';
import {
  createNotification,
  __notificationModule,
} from '../../src/models/Notification.js';
import {
  createPaper,
  __paperModule,
} from '../../src/models/Paper.js';
import {
  createReview,
  isSubmittedReview,
  __reviewModule,
} from '../../src/models/Review.js';
import {
  createReviewDraft,
  __reviewDraftModule,
} from '../../src/models/ReviewDraft.js';
import {
  createReviewForm,
  isFormClosed,
  __reviewFormModule,
} from '../../src/models/ReviewForm.js';
import {
  createValidationError,
  __validationErrorModule,
} from '../../src/models/ValidationError.js';
import {
  createValidationRuleSet,
  loadValidationRuleSet,
  __validationRuleSetModule,
} from '../../src/models/ValidationRuleSet.js';

import { createAuditLog as createAuditLogImpl } from '../../src/models/audit-log.js';
import { createDeliveryEvent as createDeliveryEventImpl } from '../../src/models/delivery-event.js';
import { createEditor as createEditorImpl, hasEditorPermission as hasEditorPermissionImpl } from '../../src/models/editor.js';
import { createNotification as createNotificationImpl } from '../../src/models/notification.js';
import { createPaper as createPaperImpl } from '../../src/models/paper.js';
import { createReview as createReviewImpl, isSubmittedReview as isSubmittedReviewImpl } from '../../src/models/review.js';
import { createReviewDraft as createReviewDraftImpl } from '../../src/models/review-draft.js';
import { createReviewForm as createReviewFormImpl, isFormClosed as isFormClosedImpl } from '../../src/models/review-form.js';
import { createValidationError as createValidationErrorImpl } from '../../src/models/validation-error.js';
import { createValidationRuleSet as createValidationRuleSetImpl, loadValidationRuleSet as loadValidationRuleSetImpl } from '../../src/models/validation-rule-set.js';

test('model wrapper modules re-export implementations', () => {
  expect(createAuditLog).toBe(createAuditLogImpl);
  expect(createDeliveryEvent).toBe(createDeliveryEventImpl);
  expect(createEditor).toBe(createEditorImpl);
  expect(hasEditorPermission).toBe(hasEditorPermissionImpl);
  expect(createNotification).toBe(createNotificationImpl);
  expect(createPaper).toBe(createPaperImpl);
  expect(createReview).toBe(createReviewImpl);
  expect(isSubmittedReview).toBe(isSubmittedReviewImpl);
  expect(createReviewDraft).toBe(createReviewDraftImpl);
  expect(createReviewForm).toBe(createReviewFormImpl);
  expect(isFormClosed).toBe(isFormClosedImpl);
  expect(createValidationError).toBe(createValidationErrorImpl);
  expect(createValidationRuleSet).toBe(createValidationRuleSetImpl);
  expect(loadValidationRuleSet).toBe(loadValidationRuleSetImpl);
});

test('model wrapper modules execute', () => {
  expect(__auditLogModule).toBe(true);
  expect(__deliveryEventModule).toBe(true);
  expect(__editorModule).toBe(true);
  expect(__notificationModule).toBe(true);
  expect(__paperModule).toBe(true);
  expect(__reviewModule).toBe(true);
  expect(__reviewDraftModule).toBe(true);
  expect(__reviewFormModule).toBe(true);
  expect(__validationErrorModule).toBe(true);
  expect(__validationRuleSetModule).toBe(true);
});
