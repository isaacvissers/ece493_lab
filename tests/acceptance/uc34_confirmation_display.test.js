import { sessionState } from '../../src/models/session-state.js';
import { registrationService } from '../../src/services/registration_service.js';
import { registrationWindowService } from '../../src/services/registration_window_service.js';
import { paymentService } from '../../src/services/payment_service.js';
import { paymentStorageService } from '../../src/services/payment_storage_service.js';
import { confirmationStorageService } from '../../src/services/confirmation_storage_service.js';
import { confirmationGeneratorService } from '../../src/services/confirmation_generator_service.js';
import { confirmationNotificationService } from '../../src/services/confirmation_notification_service.js';
import { createConfirmationView } from '../../src/views/confirmation_view.js';
import { createConfirmationController } from '../../src/controllers/confirmation_controller.js';

beforeEach(() => {
  sessionState.clear();
  registrationService.reset();
  registrationWindowService.setWindow({
    startAt: new Date(Date.now() - 1000 * 60).toISOString(),
    endAt: new Date(Date.now() + 1000 * 60).toISOString(),
  });
  paymentService.reset();
  paymentStorageService.reset();
  confirmationStorageService.reset();
  confirmationGeneratorService.reset();
  confirmationNotificationService.reset();
  document.body.innerHTML = '';
});

test('confirmation displays HTML summary without download or print options', () => {
  const registrationResult = registrationService.submitRegistration({
    userId: 'acct_attendee',
    values: {
      name: 'Ada Lovelace',
      affiliation: 'Computing',
      contactEmail: 'ada@example.com',
      attendanceType: 'virtual',
    },
    paymentService,
  });
  sessionState.authenticate({ id: 'acct_attendee', email: 'ada@example.com' });

  const view = createConfirmationView();
  const controller = createConfirmationController({ view, sessionState });
  controller.show({ registrationId: registrationResult.registration.id });
  document.body.appendChild(view.element);

  expect(document.body.querySelectorAll('dl').length).toBeGreaterThan(0);
  expect(document.body.textContent).not.toContain('Download');
  expect(document.body.textContent).not.toContain('Print');
});
