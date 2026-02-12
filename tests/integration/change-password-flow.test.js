import { createAccountSettingsView } from '../../src/views/account-settings-view.js';
import { createAccountController } from '../../src/controllers/account-controller.js';
import { storageService } from '../../src/services/storage-service.js';
import { sessionState } from '../../src/models/session-state.js';
import { passwordErrorLogging } from '../../src/services/password-error-logging.js';

function setupIntegration() {
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
  return view;
}

function submit(view, currentPassword, newPassword, confirmPassword) {
  view.element.querySelector('#current-password').value = currentPassword;
  view.element.querySelector('#new-password').value = newPassword;
  view.element.querySelector('#confirm-password').value = confirmPassword;
  const event = new Event('submit', { bubbles: true, cancelable: true });
  view.element.querySelector('form').dispatchEvent(event);
}

test('successful password change updates stored credentials', () => {
  storageService.reset();
  const account = {
    id: 'acct_change',
    email: 'change@example.com',
    normalizedEmail: 'change@example.com',
    password: 'oldPass1!',
    createdAt: new Date().toISOString(),
  };
  storageService.saveAccount(account);
  sessionState.authenticate(account);
  const view = setupIntegration();
  submit(view, 'oldPass1!', 'newPass1!', 'newPass1!');
  const updated = storageService.findByEmail('change@example.com');
  expect(updated.password).toBe('newPass1!');
  expect(sessionState.isAuthenticated()).toBe(true);
});

test('incorrect current password blocks update', () => {
  storageService.reset();
  const account = {
    id: 'acct_bad',
    email: 'bad@example.com',
    normalizedEmail: 'bad@example.com',
    password: 'oldPass1!',
    createdAt: new Date().toISOString(),
  };
  storageService.saveAccount(account);
  sessionState.authenticate(account);
  const view = setupIntegration();
  submit(view, 'wrongPass', 'newPass1!', 'newPass1!');
  const stored = storageService.findByEmail('bad@example.com');
  expect(stored.password).toBe('oldPass1!');
});
