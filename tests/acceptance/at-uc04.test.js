import { jest } from '@jest/globals';
import { createRegistrationView } from '../../src/views/registration-view.js';
import { createRegistrationController } from '../../src/controllers/registration-controller.js';
import { storageService } from '../../src/services/storage-service.js';
import { sessionState } from '../../src/models/session-state.js';
import { redirectLogging } from '../../src/services/redirect-logging.js';

function setupAcceptance(redirectFn) {
  const view = createRegistrationView();
  document.body.appendChild(view.element);
  const controller = createRegistrationController({
    view,
    storage: storageService,
    sessionState,
    redirectLogger: redirectLogging,
    redirectToLogin: redirectFn,
  });
  controller.init();
  return view;
}

function submit(view, email, password) {
  view.element.querySelector('#email').value = email;
  view.element.querySelector('#password').value = password;
  const event = new Event('submit', { bubbles: true, cancelable: true });
  view.element.querySelector('form').dispatchEvent(event);
}

test('confirmation message shown', () => {
  jest.useFakeTimers();
  const view = setupAcceptance(() => {});
  submit(view, 'valid@example.com', 'valid1!a');
  jest.runAllTimers();
  const status = view.element.querySelector('.status').textContent;
  expect(status).toContain('Redirecting you to the login screen');
  jest.useRealTimers();
});

test('redirect failure shows manual login link', () => {
  jest.useFakeTimers();
  const view = setupAcceptance(() => {
    throw new Error('fail');
  });
  submit(view, 'valid@example.com', 'valid1!a');
  jest.runAllTimers();
  const link = view.element.querySelector('a');
  expect(link.textContent).toContain('Go to login');
  jest.useRealTimers();
});
