import { createReviewerResponseView } from '../../src/views/reviewer-response-view.js';

test('reviewer response view updates status and detail', () => {
  const view = createReviewerResponseView();
  document.body.appendChild(view.element);
  view.setStatus('Recorded', false);
  expect(view.element.querySelector('#response-banner').textContent).toContain('Recorded');
  view.setDetail('Thanks');
  expect(view.element.querySelector('#response-detail').textContent).toContain('Thanks');

  view.setActions([{ label: 'Close', href: '#close', className: 'button secondary' }]);
  expect(view.element.querySelector('#response-actions a').textContent).toContain('Close');

  view.setStatus('Error', true);
  expect(view.element.querySelector('#response-banner').className).toContain('error');

  view.setActions();
  expect(view.element.querySelector('#response-actions').textContent).toBe('');
});

test('reviewer response view uses defaults for empty fields', () => {
  const view = createReviewerResponseView();
  document.body.appendChild(view.element);

  view.setStatus(undefined, true);
  expect(view.element.querySelector('#response-banner').textContent).toBe('');
  expect(view.element.querySelector('#response-banner').className).toContain('error');

  view.setDetail();
  expect(view.element.querySelector('#response-detail').textContent).toBe('');

  view.setActions([{ label: 'Back' }]);
  const link = view.element.querySelector('#response-actions a');
  expect(link.getAttribute('href')).toBe('#');
  expect(link.className).toContain('button secondary');
});
