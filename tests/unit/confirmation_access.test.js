import { createConfirmationController } from '../../src/controllers/confirmation_controller.js';
import { createTicketsController } from '../../src/controllers/tickets_controller.js';

function createViewStub() {
  return {
    status: null,
    confirmation: null,
    tickets: null,
    setStatus(message) {
      this.status = message;
    },
    setConfirmation(data) {
      this.confirmation = data;
    },
    setTickets(data) {
      this.tickets = data;
    },
  };
}

test('confirmation controller requires authentication', () => {
  const view = createViewStub();
  const sessionState = { isAuthenticated: () => false };
  const controller = createConfirmationController({ view, sessionState });
  controller.show({ registrationId: 'reg_1' });
  expect(view.status).toContain('log in');
});

test('confirmation controller blocks mismatched registration access', () => {
  const view = createViewStub();
  const sessionState = {
    isAuthenticated: () => true,
    getCurrentUser: () => ({ id: 'acct_2' }),
  };
  const registrationService = {
    getRegistrationById: () => ({ id: 'reg_1', userId: 'acct_1' }),
  };
  const controller = createConfirmationController({ view, sessionState, registrationService });
  controller.show({ registrationId: 'reg_1' });
  expect(view.status).toContain('not available');
});

test('tickets controller requires authentication', () => {
  const view = createViewStub();
  const sessionState = { isAuthenticated: () => false };
  const controller = createTicketsController({ view, sessionState });
  controller.show();
  expect(view.status).toContain('log in');
});
