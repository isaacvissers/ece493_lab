import { reviewDeliveryService } from '../../src/services/review-delivery-service.js';

beforeEach(() => {
  reviewDeliveryService.reset();
});

test('delivery idempotency prevents duplicates', () => {
  const first = reviewDeliveryService.deliverReview({ reviewId: 'rev_1', editorId: 'editor_1' });
  const second = reviewDeliveryService.deliverReview({ reviewId: 'rev_1', editorId: 'editor_1' });

  expect(first.ok).toBe(true);
  expect(second.ok).toBe(true);
  expect(second.status).toBe('already_delivered');
});
