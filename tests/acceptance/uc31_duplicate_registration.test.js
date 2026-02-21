import { sessionState } from '../../src/models/session-state.js';
import { storageService } from '../../src/services/storage-service.js';
import { createRegistrationView } from '../../src/views/registration_view.js';
import { createRegistrationController } from '../../src/controllers/registration_controller.js';
import { registrationWindowService } from '../../src/services/registration_window_service.js';
import { paymentService } from '../../src/services/payment_service.js';
import { registrationService } from '../../src/services/registration_service.js';

beforeEach(() => {
  storageService.reset();
  registrationService.reset();
  registrationWindowService.reset();
  paymentService.reset();
  document.body.innerHTML = '';
  const startAt = new Date(Date.now() - 1000).toISOString();
  const endAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  registrationWindowService.setWindow({ startAt, endAt });
  paymentService.setRegistrationFee(0);
  sessionState.authenticate({ id: 'user_6', email: 'user6@example.com' });
});

test('duplicate registration shows current status', () => {
  const view = createRegistrationView();
  const controller = createRegistrationController({ view, sessionState });
  controller.init();
  document.body.appendChild(view.element);

  view.setValues({
    name: 'Linus Torvalds',
    affiliation: 'Linux',
    contactEmail: 'linus@example.com',
    attendanceType: 'in_person',
  });
  view.element.querySelector('#registration-form')
    .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  view.element.querySelector('#registration-form')
    .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  expect(view.element.textContent).toContain('already registered');
});
