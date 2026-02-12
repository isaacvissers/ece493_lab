import { createLoginView } from '../../src/views/login-view.js';
import { createDashboardView } from '../../src/views/dashboard-view.js';

test('login view exposes fields and status helpers', () => {
  const view = createLoginView();
  document.body.appendChild(view.element);
  expect(view.element.querySelector('#login-email')).toBeTruthy();
  expect(view.element.querySelector('#login-password')).toBeTruthy();

  view.setStatus('ok', false);
  const status = view.element.querySelector('.status');
  expect(status.textContent).toBe('ok');

  view.setFieldError('email', 'Email is required.', 'Enter an email.');
  expect(view.element.querySelector('#login-email-error').textContent)
    .toContain('Email is required.');

  view.showAccessDenied('Access denied');
  expect(view.element.querySelector('.status').textContent).toContain('Access denied');

  view.clearErrors();
  expect(view.element.querySelector('#login-email-error').textContent).toBe('');
});

test('dashboard view includes email when provided', () => {
  const view = createDashboardView({ email: 'user@example.com' });
  expect(view.querySelector('.helper').textContent).toContain('user@example.com');
});

test('dashboard view handles missing user', () => {
  const view = createDashboardView(null);
  expect(view.querySelector('.helper').textContent).toContain('Signed in.');
});
