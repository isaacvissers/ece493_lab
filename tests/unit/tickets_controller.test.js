import { createTicketsController } from '../../src/controllers/tickets_controller.js';

function createViewStub() {
  return {
    status: null,
    tickets: null,
    setStatus(message) {
      this.status = message;
    },
    setTickets(data) {
      this.tickets = data;
    },
  };
}

test('tickets controller requires authentication', () => {
  const view = createViewStub();
  const authService = { requireAuth: () => ({ ok: false }) };
  const controller = createTicketsController({ view, authService });
  controller.show();
  expect(view.status).toContain('log in');
  expect(view.tickets).toEqual([]);
});

test('tickets controller supports default options object', () => {
  const controller = createTicketsController();
  expect(typeof controller.show).toBe('function');
});

test('tickets controller reports pending confirmation', () => {
  const view = createViewStub();
  const authService = { requireAuth: () => ({ ok: true, user: { id: 'acct_1' } }) };
  const registrationService = {
    getRegistrationForUser: () => ({ id: 'reg_1', userId: 'acct_1' }),
  };
  const confirmationGeneratorService = {
    generateConfirmation: () => ({ ok: false, reason: 'pending' }),
  };
  const controller = createTicketsController({
    view,
    authService,
    registrationService,
    confirmationGeneratorService,
  });
  controller.show();
  expect(view.status).toContain('Payment is recorded');
});

test('tickets controller reports storage failures', () => {
  const view = createViewStub();
  const authService = { requireAuth: () => ({ ok: true, user: { id: 'acct_1' } }) };
  const registrationService = {
    getRegistrationForUser: () => ({ id: 'reg_1', userId: 'acct_1' }),
  };
  const confirmationGeneratorService = {
    generateConfirmation: () => ({ ok: false, reason: 'storage_failed' }),
  };
  const controller = createTicketsController({
    view,
    authService,
    registrationService,
    confirmationGeneratorService,
  });
  controller.show();
  expect(view.status).toContain('could not be saved');
});

test('tickets controller reports payment incomplete', () => {
  const view = createViewStub();
  const authService = { requireAuth: () => ({ ok: true, user: { id: 'acct_1' } }) };
  const registrationService = {
    getRegistrationForUser: () => ({ id: 'reg_1', userId: 'acct_1' }),
  };
  const confirmationGeneratorService = {
    generateConfirmation: () => ({ ok: false, reason: 'payment_incomplete' }),
  };
  const controller = createTicketsController({
    view,
    authService,
    registrationService,
    confirmationGeneratorService,
  });
  controller.show();
  expect(view.status).toContain('not completed');
});

test('tickets controller handles missing registration service', () => {
  const view = createViewStub();
  const authService = { requireAuth: () => ({ ok: true, user: { id: 'acct_1' } }) };
  const registrationService = {};
  const controller = createTicketsController({
    view,
    authService,
    registrationService,
  });
  controller.show();
  expect(view.status).toContain('No tickets available');
});

test('tickets controller reports unknown errors as not available', () => {
  const view = createViewStub();
  const authService = { requireAuth: () => ({ ok: true, user: { id: 'acct_1' } }) };
  const registrationService = {
    getRegistrationForUser: () => ({ id: 'reg_1', userId: 'acct_1' }),
  };
  const confirmationGeneratorService = {
    generateConfirmation: () => ({ ok: false, reason: 'unknown' }),
  };
  const controller = createTicketsController({
    view,
    authService,
    registrationService,
    confirmationGeneratorService,
  });
  controller.show();
  expect(view.status).toContain('No tickets available');
});

test('tickets controller returns tickets when available', () => {
  const view = createViewStub();
  const authService = { requireAuth: () => ({ ok: true, user: { id: 'acct_1' } }) };
  const registrationService = {
    getRegistrationForUser: () => ({ id: 'reg_1', userId: 'acct_1' }),
  };
  const confirmationGeneratorService = {
    generateConfirmation: () => ({ ok: true, receipt: { registrationId: 'reg_1' } }),
  };
  const controller = createTicketsController({
    view,
    authService,
    registrationService,
    confirmationGeneratorService,
  });
  controller.show();
  expect(view.tickets).toHaveLength(1);
});

test('tickets controller resolves userId from userId field', () => {
  const view = createViewStub();
  let capturedUserId = null;
  const authService = { requireAuth: () => ({ ok: true, user: { userId: 'acct_2' } }) };
  const registrationService = {
    getRegistrationForUser: (userId) => {
      capturedUserId = userId;
      return { id: 'reg_2', userId };
    },
  };
  const confirmationGeneratorService = {
    generateConfirmation: () => ({ ok: true, receipt: { registrationId: 'reg_2' } }),
  };
  const controller = createTicketsController({
    view,
    authService,
    registrationService,
    confirmationGeneratorService,
  });
  controller.show();
  expect(capturedUserId).toBe('acct_2');
});

test('tickets controller resolves userId from email', () => {
  const view = createViewStub();
  let capturedUserId = null;
  const authService = { requireAuth: () => ({ ok: true, user: { email: 'user@example.com' } }) };
  const registrationService = {
    getRegistrationForUser: (userId) => {
      capturedUserId = userId;
      return { id: 'reg_3', userId };
    },
  };
  const confirmationGeneratorService = {
    generateConfirmation: () => ({ ok: true, receipt: { registrationId: 'reg_3' } }),
  };
  const controller = createTicketsController({
    view,
    authService,
    registrationService,
    confirmationGeneratorService,
  });
  controller.show();
  expect(capturedUserId).toBe('user@example.com');
});
