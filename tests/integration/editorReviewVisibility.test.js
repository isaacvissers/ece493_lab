import { createEditorReviewListView } from '../../src/views/editor-review-list-view.js';
import { reviewDeliveryService } from '../../src/services/review-delivery-service.js';

beforeEach(() => {
  reviewDeliveryService.reset();
  document.body.innerHTML = '';
});

test('editor sees delivered review in list', () => {
  reviewDeliveryService.deliverReview({ reviewId: 'rev_1', editorId: 'editor_1' });
  const view = createEditorReviewListView();
  document.body.appendChild(view.element);

  const reviews = reviewDeliveryService.getEditorReviews('editor_1');
  view.setReviews(reviews);

  expect(view.element.querySelector('#editor-review-list').textContent).toContain('rev_1');
});
