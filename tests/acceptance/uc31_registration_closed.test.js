import { sessionState } from '../../src/models/session-state.js';
import { storageService } from '../../src/services/storage-service.js';
import { createRegistrationView } from '../../src/views/registration_view.js';
import { createRegistrationController } from '../../src/controllers/registration_controller.js';
import { registrationWindowService } from '../../src/services/registration_window_service.js';
import { registrationService } from '../../src/services/registration_service.js';
import { paymentService } from '../../src/services/payment_service.js';

beforeEach(() => {
  storageService.reset();
  registrationService.reset();
  registrationWindowService.reset();
  paymentService.reset();
  document.body.innerHTML = '';
  const startAt = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
  const endAt = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
  registrationWindowService.setWindow({ startAt, endAt });
  sessionState.authenticate({ id: 'user_3', email: 'user3@example.com' });
});

test('registration is blocked when window is closed', () => {
  const view = createRegistrationView();
  const controller = createRegistrationController({ view, sessionState });
  controller.init();
  document.body.appendChild(view.element);

  view.setValues({
    name: 'Tim Berners-Lee',
    affiliation: 'W3C',
    contactEmail: 'tim@example.com',
    attendanceType: 'in_person',
  });

  view.element.querySelector('#registration-form')
    .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  expect(view.element.textContent).toContain('Registration closed');
  expect(view.element.querySelector('#registration-submit').disabled).toBe(true);
});
