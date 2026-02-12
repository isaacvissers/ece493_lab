import { jest } from '@jest/globals';
import { createRegistrationView } from '../../src/views/registration-view.js';
import { createRegistrationController } from '../../src/controllers/registration-controller.js';
import { storageService } from '../../src/services/storage-service.js';
import { sessionState } from '../../src/models/session-state.js';

function setupIntegration(onRegistrationSuccess) {
  const view = createRegistrationView();
  document.body.appendChild(view.element);
  const controller = createRegistrationController({
    view,
    storage: storageService,
    sessionState,
    onRegistrationSuccess,
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

test('successful registration flow', () => {
  jest.useFakeTimers();
  storageService.reset();
  const onRegistrationSuccess = jest.fn();
  const view = setupIntegration(onRegistrationSuccess);
  submit(view, 'flow@example.com', 'valid1!a');
  jest.runAllTimers();
  const stored = storageService.findByEmail('flow@example.com');
  expect(stored).toBeTruthy();
  expect(view.element.querySelector('.status').textContent).toContain('Registration complete');
  expect(sessionState.isAuthenticated()).toBe(true);
  expect(onRegistrationSuccess).toHaveBeenCalled();
  jest.useRealTimers();
});

test('retry after failure leaves clean state', () => {
  storageService.reset();
  storageService.setFailureMode(true);
  const view = setupIntegration(() => {});
  submit(view, 'retry@example.com', 'valid1!a');
  expect(storageService.findByEmail('retry@example.com')).toBe(null);
  storageService.setFailureMode(false);
  submit(view, 'retry@example.com', 'valid1!a');
  const stored = storageService.findByEmail('retry@example.com');
  expect(stored).toBeTruthy();
});
