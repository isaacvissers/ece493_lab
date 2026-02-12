import { createRegistrationView } from '../../src/views/registration-view.js';
import { createRegistrationController } from '../../src/controllers/registration-controller.js';
import { validationService } from '../../src/services/validation-service.js';
import { storageService } from '../../src/services/storage-service.js';
import { sessionState } from '../../src/models/session-state.js';
import { redirectLogging } from '../../src/services/redirect-logging.js';

function setupIntegration(redirectFn) {
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

test('compliant password proceeds', () => {
  storageService.reset();
  const view = setupIntegration(() => {});
  submit(view, 'valid@example.com', 'valid1!a');
  expect(storageService.findByEmail('valid@example.com')).toBeTruthy();
});

test('policy failure blocks continuation', () => {
  storageService.reset();
  const view = setupIntegration(() => {});
  validationService.setPolicyAvailable(false);
  submit(view, 'valid@example.com', 'valid1!a');
  validationService.setPolicyAvailable(true);
  const error = view.element.querySelector('#password-error').textContent;
  expect(error).toContain('unavailable');
});
