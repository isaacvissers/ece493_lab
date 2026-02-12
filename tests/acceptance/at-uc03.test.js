import { createRegistrationView } from '../../src/views/registration-view.js';
import { createRegistrationController } from '../../src/controllers/registration-controller.js';
import { validationService } from '../../src/services/validation-service.js';
import { storageService } from '../../src/services/storage-service.js';
import { sessionState } from '../../src/models/session-state.js';
import { redirectLogging } from '../../src/services/redirect-logging.js';

function setupAcceptance() {
  const view = createRegistrationView();
  document.body.appendChild(view.element);
  const controller = createRegistrationController({
    view,
    storage: storageService,
    sessionState,
    redirectLogger: redirectLogging,
    redirectToLogin: () => {},
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

test('too-short password error text', () => {
  const view = setupAcceptance();
  submit(view, 'valid@example.com', 'a1!');
  const error = view.element.querySelector('#password-error').textContent;
  expect(error).toContain('Password is too short.');
});

test('complexity error text', () => {
  const view = setupAcceptance();
  submit(view, 'valid@example.com', 'password!');
  const error = view.element.querySelector('#password-error').textContent;
  expect(error).toContain('must include a number and a symbol');
});

test('disallowed content error text', () => {
  const view = setupAcceptance();
  submit(view, 'valid@example.com', 'valid 1!a');
  const error = view.element.querySelector('#password-error').textContent;
  expect(error).toContain('disallowed content');
});

test('policy unavailable error text', () => {
  const view = setupAcceptance();
  validationService.setPolicyAvailable(false);
  submit(view, 'valid@example.com', 'valid1!a');
  validationService.setPolicyAvailable(true);
  const error = view.element.querySelector('#password-error').textContent;
  expect(error).toContain('Password validation is unavailable');
});
