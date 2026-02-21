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
  const startAt = new Date(Date.now() - 1000).toISOString();
  const endAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  registrationWindowService.setWindow({ startAt, endAt });
  paymentService.setRegistrationFee(50);
  sessionState.authenticate({ id: 'user_9', email: 'user9@example.com' });
});

test('payment failure allows retry before marking registered', () => {
  paymentService.setFailureMode({ initial: true, retry: false });
  const view = createRegistrationView();
  const controller = createRegistrationController({ view, sessionState });
  controller.init();
  document.body.appendChild(view.element);

  view.setValues({
    name: 'Katherine Johnson',
    affiliation: 'NASA',
    contactEmail: 'kj@example.com',
    attendanceType: 'in_person',
  });
  view.element.querySelector('#registration-form')
    .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  const retryButton = view.element.querySelector('#registration-retry-payment');
  expect(view.element.textContent).toContain('Payment failed');
  expect(retryButton.hidden).toBe(false);

  paymentService.setFailureMode({ initial: false, retry: false });
  retryButton.click();

  expect(view.element.textContent).toContain('Registration complete');
  expect(retryButton.hidden).toBe(true);
});
