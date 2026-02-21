import { sessionState } from '../../src/models/session-state.js';
import { storageService } from '../../src/services/storage-service.js';
import { createRegistrationView } from '../../src/views/registration_view.js';
import { createRegistrationController } from '../../src/controllers/registration_controller.js';
import { registrationWindowService } from '../../src/services/registration_window_service.js';
import { registrationService } from '../../src/services/registration_service.js';
import { paymentService } from '../../src/services/payment_service.js';
import { registrationLogService } from '../../src/services/registration_log_service.js';

beforeEach(() => {
  storageService.reset();
  registrationService.reset();
  registrationWindowService.reset();
  paymentService.reset();
  registrationLogService.reset();
  document.body.innerHTML = '';
  const startAt = new Date(Date.now() - 1000).toISOString();
  const endAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  registrationWindowService.setWindow({ startAt, endAt });
  sessionState.authenticate({ id: 'user_7', email: 'user7@example.com' });
});

test('save failure logs and shows error', () => {
  registrationService.setFailureMode(true);
  const view = createRegistrationView();
  const controller = createRegistrationController({ view, sessionState });
  controller.init();
  document.body.appendChild(view.element);

  view.setValues({
    name: 'Ada',
    affiliation: 'Lab',
    contactEmail: 'ada@example.com',
    attendanceType: 'virtual',
  });
  view.element.querySelector('#registration-form')
    .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  expect(view.element.textContent).toContain('could not be saved');
  expect(registrationLogService.getLogs()[0].event).toBe('save_failure');
});
