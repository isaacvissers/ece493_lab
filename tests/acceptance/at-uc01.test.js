import { createRegistrationView } from '../../src/views/registration-view.js';
import { createRegistrationController } from '../../src/controllers/registration-controller.js';
import { storageService } from '../../src/services/storage-service.js';
import { sessionState } from '../../src/models/session-state.js';

function setupAcceptance() {
  const view = createRegistrationView();
  document.body.appendChild(view.element);
  const controller = createRegistrationController({
    view,
    storage: storageService,
    sessionState,
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

test('success confirmation mentions signed-in flow', () => {
  const view = setupAcceptance();
  submit(view, 'accept@example.com', 'valid1!a');
  const status = view.element.querySelector('.status').textContent;
  expect(status).toContain('Registration complete');
  expect(status).toContain('Signing you in');
  expect(sessionState.isAuthenticated()).toBe(true);
});

test('registration offers navigation back to login', () => {
  const view = setupAcceptance();
  const loginButton = view.element.querySelector('#login-button');
  expect(loginButton).toBeTruthy();
});

test('invalid email shows recovery instruction', () => {
  const view = setupAcceptance();
  submit(view, 'invalid', 'valid1!a');
  const error = view.element.querySelector('#email-error').textContent;
  expect(error).toContain('Use one "@"');
});

test('invalid password shows recovery instruction', () => {
  const view = setupAcceptance();
  submit(view, 'valid@example.com', 'password');
  const error = view.element.querySelector('#password-error').textContent;
  expect(error).toContain('number and a symbol');
});
