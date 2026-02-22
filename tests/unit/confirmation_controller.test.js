import { jest } from '@jest/globals';
import { createConfirmationController } from '../../src/controllers/confirmation_controller.js';

function createViewStub() {
  return {
    status: null,
    confirmation: null,
    setStatus(message) {
      this.status = message;
    },
    setConfirmation(data) {
      this.confirmation = data;
    },
  };
}

test('confirmation controller requires authentication', () => {
  const view = createViewStub();
  const authService = { requireAuth: () => ({ ok: false }) };
  const controller = createConfirmationController({ view, authService });
  controller.show({ registrationId: 'reg_1' });
  expect(view.status).toContain('log in');
});

test('confirmation controller supports default options object', () => {
  const controller = createConfirmationController();
  expect(typeof controller.show).toBe('function');
});

test('confirmation controller handles pending confirmations with error view', () => {
  const view = createViewStub();
  const errorView = { setMessage: jest.fn() };
  const authService = { requireAuth: () => ({ ok: true, user: { id: 'acct_1' } }) };
  const registrationService = {
    getRegistrationById: () => ({ id: 'reg_1', userId: 'acct_1' }),
  };
  const confirmationGeneratorService = {
    generateConfirmation: () => ({ ok: false, reason: 'pending' }),
  };
  const controller = createConfirmationController({
    view,
    errorView,
    authService,
    registrationService,
    confirmationGeneratorService,
  });
  controller.show({ registrationId: 'reg_1' });
  expect(errorView.setMessage).toHaveBeenCalled();
});

test('confirmation controller reports pending without error view', () => {
  const view = createViewStub();
  const authService = { requireAuth: () => ({ ok: true, user: { id: 'acct_1' } }) };
  const registrationService = {
    getRegistrationById: () => ({ id: 'reg_1', userId: 'acct_1' }),
  };
  const confirmationGeneratorService = {
    generateConfirmation: () => ({ ok: false, reason: 'pending' }),
  };
  const controller = createConfirmationController({
    view,
    authService,
    registrationService,
    confirmationGeneratorService,
  });
  controller.show({ registrationId: 'reg_1' });
  expect(view.status).toContain('Payment is recorded');
});

test('confirmation controller reports storage failures', () => {
  const view = createViewStub();
  const authService = { requireAuth: () => ({ ok: true, user: { id: 'acct_1' } }) };
  const registrationService = {
    getRegistrationById: () => ({ id: 'reg_1', userId: 'acct_1' }),
  };
  const confirmationGeneratorService = {
    generateConfirmation: () => ({ ok: false, reason: 'storage_failed' }),
  };
  const controller = createConfirmationController({
    view,
    authService,
    registrationService,
    confirmationGeneratorService,
  });
  controller.show({ registrationId: 'reg_1' });
  expect(view.status).toContain('could not be saved');
});

test('confirmation controller reports storage failures with error view', () => {
  const view = createViewStub();
  const errorView = { setMessage: jest.fn() };
  const authService = { requireAuth: () => ({ ok: true, user: { id: 'acct_1' } }) };
  const registrationService = {
    getRegistrationById: () => ({ id: 'reg_1', userId: 'acct_1' }),
  };
  const confirmationGeneratorService = {
    generateConfirmation: () => ({ ok: false, reason: 'storage_failed' }),
  };
  const controller = createConfirmationController({
    view,
    errorView,
    authService,
    registrationService,
    confirmationGeneratorService,
  });
  controller.show({ registrationId: 'reg_1' });
  expect(errorView.setMessage).toHaveBeenCalled();
});

test('confirmation controller reports payment incomplete', () => {
  const view = createViewStub();
  const authService = { requireAuth: () => ({ ok: true, user: { id: 'acct_1' } }) };
  const registrationService = {
    getRegistrationById: () => ({ id: 'reg_1', userId: 'acct_1' }),
  };
  const confirmationGeneratorService = {
    generateConfirmation: () => ({ ok: false, reason: 'payment_incomplete' }),
  };
  const controller = createConfirmationController({
    view,
    authService,
    registrationService,
    confirmationGeneratorService,
  });
  controller.show({ registrationId: 'reg_1' });
  expect(view.status).toContain('not completed');
});

test('confirmation controller reports unknown failures as not available', () => {
  const view = createViewStub();
  const authService = { requireAuth: () => ({ ok: true, user: { id: 'acct_1' } }) };
  const registrationService = {
    getRegistrationById: () => ({ id: 'reg_1', userId: 'acct_1' }),
  };
  const confirmationGeneratorService = {
    generateConfirmation: () => ({ ok: false, reason: 'unknown' }),
  };
  const controller = createConfirmationController({
    view,
    authService,
    registrationService,
    confirmationGeneratorService,
  });
  controller.show({ registrationId: 'reg_1' });
  expect(view.status).toContain('not available');
});

test('confirmation controller shows notification failure status', () => {
  const view = createViewStub();
  const authService = { requireAuth: () => ({ ok: true, user: { id: 'acct_1' } }) };
  const registrationService = {
    getRegistrationById: () => ({ id: 'reg_1', userId: 'acct_1' }),
  };
  const confirmationGeneratorService = {
    generateConfirmation: () => ({
      ok: true,
      receipt: { registrationId: 'reg_1' },
      notification: { ok: false },
    }),
  };
  const controller = createConfirmationController({
    view,
    authService,
    registrationService,
    confirmationGeneratorService,
  });
  controller.show({ registrationId: 'reg_1' });
  expect(view.status).toContain('delivery failed');
});

test('confirmation controller resolves registration from user when id missing', () => {
  const view = createViewStub();
  const authService = { requireAuth: () => ({ ok: true, user: { id: 'acct_1' } }) };
  const registrationService = {
    getRegistrationForUser: () => ({ id: 'reg_1', userId: 'acct_1' }),
  };
  const confirmationGeneratorService = {
    generateConfirmation: () => ({ ok: true, receipt: { registrationId: 'reg_1' } }),
  };
  const controller = createConfirmationController({
    view,
    authService,
    registrationService,
    confirmationGeneratorService,
  });
  controller.show();
  expect(view.confirmation.registrationId).toBe('reg_1');
});

test('confirmation controller handles missing user id', () => {
  const view = createViewStub();
  const authService = { requireAuth: () => ({ ok: true, user: null }) };
  const registrationService = {};
  const confirmationGeneratorService = { generateConfirmation: () => ({ ok: true }) };
  const controller = createConfirmationController({
    view,
    authService,
    registrationService,
    confirmationGeneratorService,
  });
  controller.show();
  expect(view.status).toContain('not available');
});

test('confirmation controller handles missing user lookup method', () => {
  const view = createViewStub();
  const authService = { requireAuth: () => ({ ok: true, user: { id: 'acct_5' } }) };
  const registrationService = {};
  const confirmationGeneratorService = { generateConfirmation: () => ({ ok: true }) };
  const controller = createConfirmationController({
    view,
    authService,
    registrationService,
    confirmationGeneratorService,
  });
  controller.show();
  expect(view.status).toContain('not available');
});

test('confirmation controller handles missing registration lookup', () => {
  const view = createViewStub();
  const authService = { requireAuth: () => ({ ok: true, user: { id: 'acct_1' } }) };
  const registrationService = {};
  const confirmationGeneratorService = { generateConfirmation: () => ({ ok: true }) };
  const controller = createConfirmationController({
    view,
    authService,
    registrationService,
    confirmationGeneratorService,
  });
  controller.show({ registrationId: 'reg_1' });
  expect(view.status).toContain('not available');
});

test('confirmation controller resolves registration from userId', () => {
  const view = createViewStub();
  const authService = { requireAuth: () => ({ ok: true, user: { userId: 'acct_2' } }) };
  const registrationService = {
    getRegistrationForUser: (userId) => ({ id: 'reg_2', userId }),
  };
  const confirmationGeneratorService = {
    generateConfirmation: () => ({ ok: true, receipt: { registrationId: 'reg_2' } }),
  };
  const controller = createConfirmationController({
    view,
    authService,
    registrationService,
    confirmationGeneratorService,
  });
  controller.show();
  expect(view.confirmation.registrationId).toBe('reg_2');
});

test('confirmation controller resolves registration from email', () => {
  const view = createViewStub();
  const authService = { requireAuth: () => ({ ok: true, user: { email: 'user@example.com' } }) };
  const registrationService = {
    getRegistrationForUser: (userId) => ({ id: 'reg_3', userId }),
  };
  const confirmationGeneratorService = {
    generateConfirmation: () => ({ ok: true, receipt: { registrationId: 'reg_3' } }),
  };
  const controller = createConfirmationController({
    view,
    authService,
    registrationService,
    confirmationGeneratorService,
  });
  controller.show();
  expect(view.confirmation.registrationId).toBe('reg_3');
});

test('confirmation controller handles missing receipt payload', () => {
  const view = createViewStub();
  const authService = { requireAuth: () => ({ ok: true, user: { id: 'acct_4' } }) };
  const registrationService = {
    getRegistrationById: () => ({ id: 'reg_4', userId: 'acct_4' }),
  };
  const confirmationGeneratorService = { generateConfirmation: () => ({ ok: true }) };
  const controller = createConfirmationController({
    view,
    authService,
    registrationService,
    confirmationGeneratorService,
  });
  controller.show({ registrationId: 'reg_4' });
  expect(view.confirmation).toEqual({});
});
