import { sessionState } from '../../src/models/session-state.js';
import { storageService } from '../../src/services/storage-service.js';
import { createRegistrationView } from '../../src/views/registration_view.js';
import { createRegistrationController } from '../../src/controllers/registration_controller.js';
import { registrationWindowService } from '../../src/services/registration_window_service.js';
import { registrationService } from '../../src/services/registration_service.js';
import { paymentService } from '../../src/services/payment_service.js';
import { notificationService } from '../../src/services/notification_service.js';
import { registrationLogService } from '../../src/services/registration_log_service.js';

beforeEach(() => {
  storageService.reset();
  registrationService.reset();
  registrationWindowService.reset();
  paymentService.reset();
  notificationService.reset();
  registrationLogService.reset();
  document.body.innerHTML = '';
  const startAt = new Date(Date.now() - 1000).toISOString();
  const endAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  registrationWindowService.setWindow({ startAt, endAt });
  paymentService.setRegistrationFee(0);
  sessionState.authenticate({ id: 'user_8', email: 'user8@example.com' });
});

test('notification failures are logged without blocking registration', () => {
  notificationService.setFailureMode({ email: true, inApp: false });
  const view = createRegistrationView();
  const controller = createRegistrationController({ view, sessionState });
  controller.init();
  document.body.appendChild(view.element);

  view.setValues({
    name: 'Alan Turing',
    affiliation: 'Bletchley',
    contactEmail: 'alan@example.com',
    attendanceType: 'virtual',
  });
  view.element.querySelector('#registration-form')
    .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  expect(view.element.textContent).toContain('confirmation failed');
  expect(registrationLogService.getLogs()[0].event).toBe('notification_failure');
});
