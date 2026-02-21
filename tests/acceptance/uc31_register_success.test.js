import { sessionState } from '../../src/models/session-state.js';
import { storageService } from '../../src/services/storage-service.js';
import { createRegistrationView } from '../../src/views/registration_view.js';
import { createRegistrationController } from '../../src/controllers/registration_controller.js';
import { registrationWindowService } from '../../src/services/registration_window_service.js';
import { paymentService } from '../../src/services/payment_service.js';
import { registrationService } from '../../src/services/registration_service.js';
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
  sessionState.authenticate({ id: 'user_1', email: 'user@example.com' });
});

test('authenticated user can register during open window', () => {
  const view = createRegistrationView();
  const controller = createRegistrationController({ view, sessionState });
  controller.init();
  document.body.appendChild(view.element);

  view.setValues({
    name: 'Ada Lovelace',
    affiliation: 'Analytical Engine',
    contactEmail: 'ada@example.com',
    attendanceType: 'virtual',
  });

  view.element.querySelector('#registration-form')
    .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  const receiptName = view.element.querySelector('#registration-receipt-name').textContent;
  expect(receiptName).toContain('Ada Lovelace');
  expect(view.element.textContent).toContain('Registration complete.');
});
