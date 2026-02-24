import { createEditorReviewListView } from '../../src/views/editor-review-list-view.js';
import { createReviewSubmitController } from '../../src/controllers/review-submit-controller.js';
import { createEditorReviewAccessController } from '../../src/controllers/editor-review-access-controller.js';
import { reviewDeliveryService } from '../../src/services/review-delivery-service.js';
import { notificationService } from '../../src/services/notification-service.js';
import { adminFlagService } from '../../src/services/admin-flag-service.js';
import { auditLogService } from '../../src/services/audit-log-service.js';
import { createReview } from '../../src/models/review.js';
import { createPaper } from '../../src/models/paper.js';
import { createEditor } from '../../src/models/editor.js';

beforeEach(() => {
  reviewDeliveryService.reset();
  notificationService.clear();
  adminFlagService.reset();
  auditLogService.reset();
  document.body.innerHTML = '';
});

test('AT-UC23-01: submitted review appears in editor list', () => {
  reviewDeliveryService.deliverReview({ reviewId: 'rev_1', editorId: 'editor_1' });
  const view = createEditorReviewListView();
  document.body.appendChild(view.element);

  const reviews = reviewDeliveryService.getEditorReviews('editor_1');
  view.setReviews(reviews);

  expect(view.element.querySelector('#editor-review-list').textContent).toContain('rev_1');
});

test('AT-UC23-02: editor notification generated on submitted review', () => {
  const review = createReview({ reviewId: 'rev_note', paperId: 'paper_1', reviewerId: 'rev', status: 'submitted' });
  const paper = createPaper({ paperId: 'paper_1', editorId: 'editor_1' });

  const controller = createReviewSubmitController({
    review,
    paper,
    notificationsEnabled: true,
    auditLogService,
    adminFlagService,
  });

  const result = controller.submit();
  expect(result.ok).toBe(true);
  expect(notificationService.getReviewNotifications()).toHaveLength(1);
});

test('AT-UC23-03: notification failure does not prevent editor access', () => {
  notificationService.setReviewFailureMode(true);
  const review = createReview({ reviewId: 'rev_nf', paperId: 'paper_1', reviewerId: 'rev', status: 'submitted' });
  const paper = createPaper({ paperId: 'paper_1', editorId: 'editor_1' });

  const controller = createReviewSubmitController({
    review,
    paper,
    deliveryService: reviewDeliveryService,
    notificationsEnabled: true,
    auditLogService,
    adminFlagService,
  });

  const result = controller.submit();
  expect(result.ok).toBe(true);
  expect(reviewDeliveryService.getEditorReviews('editor_1')).toHaveLength(1);
});

test('AT-UC23-04: failed submission does not trigger delivery', () => {
  const review = createReview({ reviewId: 'rev_fail', paperId: 'paper_1', reviewerId: 'rev', status: 'draft' });
  const paper = createPaper({ paperId: 'paper_1', editorId: 'editor_1' });

  const controller = createReviewSubmitController({
    review,
    paper,
    deliveryService: reviewDeliveryService,
    auditLogService,
    adminFlagService,
  });

  const result = controller.submit();
  expect(result.ok).toBe(false);
  expect(reviewDeliveryService.getEditorReviews('editor_1')).toHaveLength(0);
});

test('AT-UC23-05: missing editor mapping flags issue and logs', () => {
  const review = createReview({ reviewId: 'rev_miss', paperId: 'paper_1', reviewerId: 'rev', status: 'submitted' });
  const paper = createPaper({ paperId: 'paper_1', editorId: null });

  const controller = createReviewSubmitController({
    review,
    paper,
    adminFlagService,
    auditLogService,
  });

  const result = controller.submit();
  expect(result.ok).toBe(false);
  expect(adminFlagService.getFlags()).toHaveLength(1);
});

test('AT-UC23-06: editor permission misconfiguration prevents access', () => {
  const editor = createEditor({ editorId: 'editor_1', permissions: [] });
  const controller = createEditorReviewAccessController({ editor, requiredPermission: 'review_access' });
  expect(controller.canAccess()).toBe(false);
});

test('AT-UC23-07: duplicate delivery attempts do not create duplicates', () => {
  reviewDeliveryService.deliverReview({ reviewId: 'rev_dup', editorId: 'editor_1' });
  reviewDeliveryService.deliverReview({ reviewId: 'rev_dup', editorId: 'editor_1' });

  const reviews = reviewDeliveryService.getEditorReviews('editor_1');
  expect(reviews).toHaveLength(1);
});

test('AT-UC23-08: batch submissions keep notifications grouped when enabled', () => {
  notificationService.setGroupingEnabled(true);
  notificationService.sendReviewNotifications({ reviewId: 'rev_b1', editorId: 'editor_1' });
  const shouldBatch = notificationService.shouldBatch(Date.now());
  expect(shouldBatch).toBe(true);
});

test('AT-UC23-09: audit/log failure does not remove editor access', () => {
  auditLogService.setFailureMode(true);
  const review = createReview({ reviewId: 'rev_audit', paperId: 'paper_1', reviewerId: 'rev', status: 'submitted' });
  const paper = createPaper({ paperId: 'paper_1', editorId: 'editor_1' });

  const controller = createReviewSubmitController({
    review,
    paper,
    auditLogService,
    adminFlagService,
  });

  const result = controller.submit();
  expect(result.ok).toBe(true);
});
