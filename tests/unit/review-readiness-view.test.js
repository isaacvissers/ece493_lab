import { createReviewReadinessView } from '../../src/views/review-readiness-view.js';

function getById(view, id) {
  return view.element.querySelector(id);
}

test('review readiness view handles missing paper and invitations', () => {
  const view = createReviewReadinessView();
  document.body.appendChild(view.element);

  view.setPaper(null);
  expect(getById(view, '#readiness-paper-meta').textContent).toBe('');

  view.setMissingInvitations();
  expect(getById(view, '#missing-invitations').textContent).toBe('');
});

test('review readiness view renders invitations and counts', () => {
  const view = createReviewReadinessView();
  document.body.appendChild(view.element);

  view.setCount(2);
  expect(getById(view, '#readiness-count').textContent).toContain('2');

  view.setMissingInvitations(['a@example.com', 'b@example.com']);
  expect(getById(view, '#missing-invitations').textContent).toContain('a@example.com');
});
