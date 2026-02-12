import { createAccountSettingsView } from '../../src/views/account-settings-view.js';
import { createAccountController } from '../../src/controllers/account-controller.js';
import { storageService } from '../../src/services/storage-service.js';
import { sessionState } from '../../src/models/session-state.js';
import { passwordErrorLogging } from '../../src/services/password-error-logging.js';

function setupAcceptance() {
  const view = createAccountSettingsView();
  document.body.appendChild(view.element);
  const controller = createAccountController({
    view,
    storage: storageService,
    sessionState,
    passwordLogger: passwordErrorLogging,
    onPasswordChanged: () => {},
  });
  controller.init();
  return { view, controller };
}

function submit(view, currentPassword, newPassword, confirmPassword) {
  view.element.querySelector('#current-password').value = currentPassword;
  view.element.querySelector('#new-password').value = newPassword;
  view.element.querySelector('#confirm-password').value = confirmPassword;
  const event = new Event('submit', { bubbles: true, cancelable: true });
  view.element.querySelector('form').dispatchEvent(event);
}

test('valid password change succeeds', () => {
  storageService.reset();
  const account = {
    id: 'acct_acc',
    email: 'acc@example.com',
    normalizedEmail: 'acc@example.com',
    password: 'oldPass1!',
    createdAt: new Date().toISOString(),
  };
  storageService.saveAccount(account);
  sessionState.authenticate(account);
  const { view } = setupAcceptance();
  submit(view, 'oldPass1!', 'newPass1!', 'newPass1!');
  expect(view.element.querySelector('.status').textContent).toContain('Password updated');
});

test('mismatched confirmation shows error', () => {
  storageService.reset();
  const account = {
    id: 'acct_mismatch',
    email: 'mismatch@example.com',
    normalizedEmail: 'mismatch@example.com',
    password: 'oldPass1!',
    createdAt: new Date().toISOString(),
  };
  storageService.saveAccount(account);
  sessionState.authenticate(account);
  const { view } = setupAcceptance();
  submit(view, 'oldPass1!', 'newPass1!', 'different');
  expect(view.element.querySelector('#confirm-password-error').textContent).toContain('match');
});

test('expired session blocks access', () => {
  storageService.reset();
  const { controller, view } = setupAcceptance();
  expect(controller.requireAuth()).toBe(false);
  expect(view.element.querySelector('.status').textContent).toContain('log in');
});
