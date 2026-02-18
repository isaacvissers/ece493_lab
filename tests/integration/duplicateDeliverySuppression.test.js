import { reviewDeliveryService } from '../../src/services/review-delivery-service.js';

beforeEach(() => {
  reviewDeliveryService.reset();
});

test('duplicate delivery attempts are suppressed', () => {
  reviewDeliveryService.deliverReview({ reviewId: 'rev_dup', editorId: 'editor_1' });
  reviewDeliveryService.deliverReview({ reviewId: 'rev_dup', editorId: 'editor_1' });

  const reviews = reviewDeliveryService.getEditorReviews('editor_1');
  expect(reviews).toHaveLength(1);
});
