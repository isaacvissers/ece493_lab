import { sessionState } from '../../src/models/session-state.js';
import { registrationService } from '../../src/services/registration_service.js';
import { registrationWindowService } from '../../src/services/registration_window_service.js';
import { paymentService } from '../../src/services/payment_service.js';
import { paymentStorageService } from '../../src/services/payment_storage_service.js';
import { confirmationStorageService } from '../../src/services/confirmation_storage_service.js';
import { confirmationGeneratorService } from '../../src/services/confirmation_generator_service.js';
import { createTicketsView } from '../../src/views/tickets_view.js';
import { createTicketsController } from '../../src/controllers/tickets_controller.js';

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
  document.body.innerHTML = '';
});

test('tickets view retrieves stored confirmation', () => {
  registrationService.submitRegistration({
    userId: 'acct_attendee',
    values: {
      name: 'Ada Lovelace',
      affiliation: 'Computing',
      contactEmail: 'ada@example.com',
      attendanceType: 'virtual',
    },
    paymentService,
  });
  sessionState.authenticate({ id: 'acct_attendee' });

  const view = createTicketsView();
  const controller = createTicketsController({ view, sessionState });
  controller.show();
  document.body.appendChild(view.element);

  expect(document.body.textContent).toContain('Ada Lovelace');
});
