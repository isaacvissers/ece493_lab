import { createRefereeAssignmentView } from '../../src/views/referee-assignment-view.js';

test('referee assignment view exposes fields and helpers', () => {
  const view = createRefereeAssignmentView();
  document.body.appendChild(view.element);
  expect(view.element.querySelector('#referee-email-1')).toBeTruthy();
  expect(view.element.querySelector('#referee-email-2')).toBeTruthy();
  expect(view.element.querySelector('#referee-email-3')).toBeTruthy();

  view.setPaper({ id: 'paper_1', title: 'Paper' });
  expect(view.element.querySelector('#paper-meta').textContent).toContain('paper_1');
  view.setPaper(null);
  expect(view.element.querySelector('#paper-meta').textContent).toBe('');

  view.setFieldError(0, 'Required');
  expect(view.element.querySelector('#referee-email-1-error').textContent).toContain('Required');
  view.setFieldError(10, 'Ignored');
  expect(view.element.querySelector('#referee-email-1-error').textContent).toContain('Required');

  view.setCountError('Exactly 3 referees are required.');
  expect(view.element.querySelector('#referee-count-error').textContent).toContain('Exactly 3');
  view.setCountError('');
  expect(view.element.querySelector('#referee-count-error').textContent).toBe('');

  view.setStatus('Saved', false);
  expect(view.element.querySelector('#assignment-banner').textContent).toContain('Saved');

  view.setWarning('Notifications failed');
  expect(view.element.querySelector('#notification-warning').textContent).toContain('Notifications failed');

  view.setAuthorizationMessage('No permission');
  expect(view.element.querySelector('#authorization-banner').textContent).toContain('No permission');

  view.setSummary({
    assigned: ['a@example.com'],
    rejected: [{ email: 'b@example.com', reason: 'limit reached' }],
  });
  expect(view.element.querySelector('#assignment-summary').textContent).toContain('Assigned: a@example.com');
  expect(view.element.querySelector('#assignment-summary').textContent).toContain('Rejected: b@example.com');
  view.setSummary({ assigned: [], rejected: [] });
  expect(view.element.querySelector('#assignment-summary').textContent).toBe('');
  view.setSummary({});
  expect(view.element.querySelector('#assignment-summary').textContent).toBe('');
  view.setSummary(null);
  expect(view.element.querySelector('#assignment-summary').textContent).toBe('');

  view.showConfirmation('paper_1', ['a@example.com', 'b@example.com', 'c@example.com']);
  expect(view.element.querySelector('#assignment-banner').textContent).toContain('paper_1');

  view.setEditable(false);
  expect(view.element.querySelector('#referee-email-1').disabled).toBe(true);
  view.setEditable(true);
  expect(view.element.querySelector('#referee-email-1').disabled).toBe(false);

  view.clearErrors();
  expect(view.element.querySelector('#referee-email-1-error').textContent).toBe('');
});
