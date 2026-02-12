import { jest } from '@jest/globals';
import { createRegistrationView } from '../../src/views/registration-view.js';
import { createRegistrationController } from '../../src/controllers/registration-controller.js';
import { storageService } from '../../src/services/storage-service.js';
import { sessionState } from '../../src/models/session-state.js';

function setupAcceptance(onRegistrationSuccess) {
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

test('confirmation message shown and user authenticated', () => {
  jest.useFakeTimers();
  const view = setupAcceptance(() => {});
  submit(view, 'valid@example.com', 'valid1!a');
  jest.runAllTimers();
  const status = view.element.querySelector('.status').textContent;
  expect(status).toContain('Registration complete');
  expect(status).toContain('Signing you in');
  expect(sessionState.isAuthenticated()).toBe(true);
  jest.useRealTimers();
});

test('registration success callback fires after delay', () => {
  jest.useFakeTimers();
  const onRegistrationSuccess = jest.fn();
  const view = setupAcceptance(onRegistrationSuccess);
  submit(view, 'valid@example.com', 'valid1!a');
  expect(onRegistrationSuccess).not.toHaveBeenCalled();
  jest.runAllTimers();
  expect(onRegistrationSuccess).toHaveBeenCalled();
  jest.useRealTimers();
});
