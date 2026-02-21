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
  const startAt = '2026-03-01T00:00:00.000Z';
  const endAt = '2026-03-10T00:00:00.000Z';
  registrationWindowService.setWindow({ startAt, endAt });
  sessionState.authenticate({ id: 'user_4', email: 'user4@example.com' });
});

test('closed window shows start/end dates', () => {
  const view = createRegistrationView();
  const controller = createRegistrationController({ view, sessionState });
  controller.init();
  document.body.appendChild(view.element);

  expect(view.element.querySelector('#registration-window').textContent).toContain('2026-03-01');
  expect(view.element.querySelector('#registration-window').textContent).toContain('2026-03-10');
});
