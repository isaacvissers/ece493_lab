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

test('valid unique email proceeds', () => {
  storageService.reset();
  const view = setupIntegration(() => {});
  submit(view, 'unique@example.com', 'valid1!a');
  expect(storageService.findByEmail('unique@example.com')).toBeTruthy();
});

test('invalid format blocks and logs', () => {
  storageService.reset();
  const view = setupIntegration(() => {});
  submit(view, 'invalid', 'valid1!a');
  const error = view.element.querySelector('#email-error').textContent;
  expect(error).toContain('invalid');
  const log = JSON.parse(localStorage.getItem('cms.validation_failures') || '[]');
  expect(log.length).toBe(1);
});
