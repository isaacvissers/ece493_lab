import { createRegistrationView } from '../../src/views/registration-view.js';
import { createRegistrationController } from '../../src/controllers/registration-controller.js';
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

test('invalid email announces accessible error', () => {
  const view = setupAcceptance();
  submit(view, 'invalid', 'valid1!a');
  const error = view.element.querySelector('#email-error').textContent;
  expect(error).toContain('Use one "@"');
});

test('duplicate email blocks continuation', () => {
  storageService.saveAccount({
    id: 'acct_dup',
    email: 'dup@example.com',
    normalizedEmail: 'dup@example.com',
    password: 'valid1!a',
    createdAt: new Date().toISOString(),
  });
  const view = setupAcceptance();
  submit(view, 'dup@example.com', 'valid1!a');
  const error = view.element.querySelector('#email-error').textContent;
  expect(error).toContain('already');
});
