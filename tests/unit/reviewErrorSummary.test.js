import { createReviewErrorSummaryView } from '../../src/views/review-error-summary-view.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('composes consolidated error summary', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const summaryView = createReviewErrorSummaryView(container);
  summaryView.setErrors([
    { field: 'summary', message: 'Summary is required.' },
    { field: 'commentsToAuthors', message: 'Comments too long.' },
  ]);

  expect(container.querySelector('#review-validation-error-summary').textContent)
    .toContain('Summary is required');
  expect(container.querySelector('#review-validation-error-summary').textContent)
    .toContain('Comments too long');
});
