import { jest } from '@jest/globals';
import { router } from '../../src/controllers/router.js';

beforeEach(() => {
  router.reset();
  document.body.innerHTML = '<main id="root"></main>';
});

test('router registers and navigates routes', () => {
  const root = document.getElementById('root');
  router.setRoot(root);
  router.register('home', () => {
    const element = document.createElement('div');
    element.textContent = 'Home';
    return element;
  });
  const result = router.navigate('home');
  expect(result).toBe(true);
  expect(root.textContent).toContain('Home');
});

test('router returns false for unknown routes', () => {
  const result = router.navigate('missing');
  expect(result).toBe(false);
});

test('router registers decision routes when controller provided', () => {
  const root = document.getElementById('root');
  router.setRoot(root);
  const controller = {
    listView: { element: document.createElement('div') },
    detailView: { element: document.createElement('div') },
    init: jest.fn(),
    showDecision: jest.fn(),
  };
  router.registerDecisionRoutes({ controller });
  const listResult = router.navigate('decisions');
  const detailResult = router.navigate('decision-detail', { paperId: 'paper_1' });
  expect(listResult).toBe(true);
  expect(detailResult).toBe(true);
  expect(controller.showDecision).toHaveBeenCalledWith('paper_1');
});

test('router registers schedule routes when controller provided', () => {
  const root = document.getElementById('root');
  router.setRoot(root);
  const controller = {
    view: { element: document.createElement('div') },
    init: jest.fn(),
  };
  controller.view.element.textContent = 'Schedule';
  router.registerScheduleRoutes({ controller });
  const result = router.navigate('schedule');
  expect(result).toBe(true);
  expect(root.textContent).toContain('Schedule');
  expect(controller.init).toHaveBeenCalled();
});

test('router registers schedule HTML routes when controller provided', () => {
  const root = document.getElementById('root');
  router.setRoot(root);
  const controller = {
    view: { element: document.createElement('div') },
    show: jest.fn(),
  };
  controller.view.element.textContent = 'Schedule HTML';
  router.registerScheduleHtmlRoutes({ controller });
  const result = router.navigate('schedule-html', { conferenceId: 'conf_1' });
  expect(result).toBe(true);
  expect(controller.show).toHaveBeenCalledWith('conf_1');
  expect(root.textContent).toContain('Schedule HTML');
});

test('router registers schedule edit routes when controller provided', () => {
  const root = document.getElementById('root');
  router.setRoot(root);
  const controller = {
    view: { element: document.createElement('div') },
    init: jest.fn(),
    show: jest.fn(),
  };
  controller.view.element.textContent = 'Schedule Edit';
  router.registerScheduleEditRoutes({ controller });
  const result = router.navigate('schedule-edit', { conferenceId: 'conf_1' });
  expect(result).toBe(true);
  expect(controller.init).toHaveBeenCalled();
  expect(controller.show).toHaveBeenCalledWith('conf_1');
  expect(root.textContent).toContain('Schedule Edit');
});

test('router registers author schedule routes when controller provided', () => {
  const root = document.getElementById('root');
  router.setRoot(root);
  const controller = {
    view: { element: document.createElement('div') },
    show: jest.fn(),
  };
  controller.view.element.textContent = 'Author Schedule';
  router.registerAuthorScheduleRoutes({ controller });
  const result = router.navigate('author-schedule', { conferenceId: 'conf_1' });
  expect(result).toBe(true);
  expect(controller.show).toHaveBeenCalledWith('conf_1');
  expect(root.textContent).toContain('Author Schedule');
});

test('router registers public schedule routes when controller provided', () => {
  const root = document.getElementById('root');
  router.setRoot(root);
  const controller = {
    view: { element: document.createElement('div') },
    show: jest.fn(),
  };
  controller.view.element.textContent = 'Public Schedule';
  router.registerPublicScheduleRoutes({ controller });
  const result = router.navigate('public-schedule', { conferenceId: 'conf_public' });
  expect(result).toBe(true);
  expect(controller.show).toHaveBeenCalledWith('conf_public');
  expect(root.textContent).toContain('Public Schedule');
});

test('router registers registration routes when controller provided', () => {
  const root = document.getElementById('root');
  router.setRoot(root);
  const controller = {
    view: { element: document.createElement('div') },
    init: jest.fn(),
    show: jest.fn(),
  };
  controller.view.element.textContent = 'Registration';
  router.registerRegistrationRoutes({ controller });
  const result = router.navigate('registration');
  expect(result).toBe(true);
  expect(controller.init).toHaveBeenCalled();
  expect(controller.show).toHaveBeenCalled();
  expect(root.textContent).toContain('Registration');
});

test('router registers price list routes when controller provided', () => {
  const root = document.getElementById('root');
  router.setRoot(root);
  const controller = {
    view: { element: document.createElement('div') },
    show: jest.fn(),
  };
  controller.view.element.textContent = 'Price List';
  router.registerPriceListRoutes({ controller });
  const result = router.navigate('price-list', { conferenceId: 'conf_1' });
  expect(result).toBe(true);
  expect(controller.show).toHaveBeenCalledWith('conf_1');
  expect(root.textContent).toContain('Price List');
});

test('router registers payment routes when controllers provided', () => {
  const root = document.getElementById('root');
  router.setRoot(root);
  const controller = {
    view: { element: document.createElement('div') },
    show: jest.fn(),
  };
  controller.view.element.textContent = 'Payment';
  const statusController = {
    view: { element: document.createElement('div') },
    show: jest.fn(),
  };
  statusController.view.element.textContent = 'Payment Status';
  router.registerPaymentRoutes({ controller, statusController });
  const payResult = router.navigate('payment', { registrationId: 'reg_1' });
  const statusResult = router.navigate('payment-status', { registrationId: 'reg_1' });
  expect(payResult).toBe(true);
  expect(statusResult).toBe(true);
  expect(controller.show).toHaveBeenCalledWith({ registrationId: 'reg_1' });
  expect(statusController.show).toHaveBeenCalledWith({ registrationId: 'reg_1' });
});

test('router registers confirmation routes when controllers provided', () => {
  const root = document.getElementById('root');
  router.setRoot(root);
  const controller = {
    view: { element: document.createElement('div') },
    show: jest.fn(),
  };
  controller.view.element.textContent = 'Confirmation';
  const ticketsController = {
    view: { element: document.createElement('div') },
    show: jest.fn(),
  };
  ticketsController.view.element.textContent = 'Tickets';
  router.registerConfirmationRoutes({ controller, ticketsController });
  const confirmResult = router.navigate('confirmation', { registrationId: 'reg_1' });
  const ticketsResult = router.navigate('tickets');
  expect(confirmResult).toBe(true);
  expect(ticketsResult).toBe(true);
  expect(controller.show).toHaveBeenCalledWith({ registrationId: 'reg_1' });
  expect(ticketsController.show).toHaveBeenCalled();
});

test('router handles confirmation routes without controllers', () => {
  router.registerConfirmationRoutes();
  const result = router.navigate('confirmation');
  expect(result).toBe(false);
});

test('router handles confirmation routes without show handlers', () => {
  const root = document.getElementById('root');
  router.setRoot(root);
  const controller = { view: { element: document.createElement('div') } };
  const ticketsController = { view: { element: document.createElement('div') } };
  controller.view.element.textContent = 'Confirmation';
  ticketsController.view.element.textContent = 'Tickets';
  router.registerConfirmationRoutes({ controller, ticketsController });
  const confirmResult = router.navigate('confirmation');
  const ticketsResult = router.navigate('tickets');
  expect(confirmResult).toBe(true);
  expect(ticketsResult).toBe(true);
});

test('router confirmation routes handle missing views', () => {
  const root = document.getElementById('root');
  router.setRoot(root);
  const controller = { show: jest.fn() };
  const ticketsController = { show: jest.fn() };
  router.registerConfirmationRoutes({ controller, ticketsController });
  const confirmResult = router.navigate('confirmation');
  const ticketsResult = router.navigate('tickets');
  expect(confirmResult).toBe(true);
  expect(ticketsResult).toBe(true);
});

test('router confirmation routes default payload to empty object', () => {
  const root = document.getElementById('root');
  router.setRoot(root);
  const controller = {
    view: { element: document.createElement('div') },
    show: jest.fn(),
  };
  router.registerConfirmationRoutes({ controller });
  const result = router.navigate('confirmation');
  expect(result).toBe(true);
  expect(controller.show).toHaveBeenCalledWith({});
});

test('router payment routes default payload to empty object', () => {
  const root = document.getElementById('root');
  router.setRoot(root);
  const controller = {
    view: { element: document.createElement('div') },
    show: jest.fn(),
  };
  router.registerPaymentRoutes({ controller });
  const result = router.navigate('payment');
  expect(result).toBe(true);
  expect(controller.show).toHaveBeenCalledWith({});
});

test('router registers payment routes when only status controller provided', () => {
  const root = document.getElementById('root');
  router.setRoot(root);
  const statusController = {
    view: { element: document.createElement('div') },
    show: jest.fn(),
  };
  statusController.view.element.textContent = 'Payment Status';
  router.registerPaymentRoutes({ statusController });
  const result = router.navigate('payment-status', { registrationId: 'reg_status' });
  expect(result).toBe(true);
  expect(statusController.show).toHaveBeenCalledWith({ registrationId: 'reg_status' });
});

test('router ignores payment routes when no controllers provided', () => {
  router.registerPaymentRoutes();
  const result = router.navigate('payment');
  expect(result).toBe(false);
});

test('router handles payment routes without views', () => {
  const root = document.getElementById('root');
  root.textContent = 'Existing';
  router.setRoot(root);
  const controller = { show: jest.fn() };
  const statusController = { show: jest.fn() };
  router.registerPaymentRoutes({ controller, statusController });
  const payResult = router.navigate('payment');
  const statusResult = router.navigate('payment-status');
  expect(payResult).toBe(true);
  expect(statusResult).toBe(true);
  expect(root.textContent).toBe('');
});

test('router handles payment routes without show handlers', () => {
  const root = document.getElementById('root');
  router.setRoot(root);
  const controller = { view: { element: document.createElement('div') } };
  const statusController = { view: { element: document.createElement('div') } };
  controller.view.element.textContent = 'Payment';
  statusController.view.element.textContent = 'Payment Status';
  router.registerPaymentRoutes({ controller, statusController });
  const payResult = router.navigate('payment');
  const statusResult = router.navigate('payment-status');
  expect(payResult).toBe(true);
  expect(statusResult).toBe(true);
});

test('router handles price list route without payload or show method', () => {
  const root = document.getElementById('root');
  router.setRoot(root);
  const controller = {
    view: { element: document.createElement('div') },
  };
  controller.view.element.textContent = 'Price List';
  router.registerPriceListRoutes({ controller });
  const result = router.navigate('price-list');
  expect(result).toBe(true);
  expect(root.textContent).toContain('Price List');
});

test('router returns null view for price list when controller view missing', () => {
  const root = document.getElementById('root');
  root.textContent = 'Existing';
  router.setRoot(root);
  const controller = {
    show: jest.fn(),
  };
  router.registerPriceListRoutes({ controller });
  const result = router.navigate('price-list', { conferenceId: 'conf_2' });
  expect(result).toBe(true);
  expect(controller.show).toHaveBeenCalledWith('conf_2');
  expect(root.textContent).toBe('');
});

test('router passes null conferenceId for price list when payload missing', () => {
  const root = document.getElementById('root');
  router.setRoot(root);
  const controller = {
    view: { element: document.createElement('div') },
    show: jest.fn(),
  };
  controller.view.element.textContent = 'Price List';
  router.registerPriceListRoutes({ controller });
  const result = router.navigate('price-list');
  expect(result).toBe(true);
  expect(controller.show).toHaveBeenCalledWith(null);
});

test('router handles schedule HTML route without payload or show method', () => {
  const root = document.getElementById('root');
  router.setRoot(root);
  const controller = {
    view: { element: document.createElement('div') },
  };
  controller.view.element.textContent = 'Schedule HTML';
  router.registerScheduleHtmlRoutes({ controller });
  const result = router.navigate('schedule-html');
  expect(result).toBe(true);
  expect(root.textContent).toContain('Schedule HTML');
});

test('router passes null conferenceId when payload missing', () => {
  const root = document.getElementById('root');
  router.setRoot(root);
  const controller = {
    view: { element: document.createElement('div') },
    show: jest.fn(),
  };
  controller.view.element.textContent = 'Schedule HTML';
  router.registerScheduleHtmlRoutes({ controller });
  const result = router.navigate('schedule-html');
  expect(result).toBe(true);
  expect(controller.show).toHaveBeenCalledWith(null);
});

test('router renders empty schedule view when controller view missing', () => {
  const root = document.getElementById('root');
  router.setRoot(root);
  const controller = {
    view: null,
    init: jest.fn(),
  };
  router.registerScheduleRoutes({ controller });
  const result = router.navigate('schedule');
  expect(result).toBe(true);
  expect(root.textContent).toBe('');
  expect(controller.init).toHaveBeenCalled();
});

test('router ignores schedule registration when controller missing', () => {
  router.registerScheduleRoutes();
  const result = router.navigate('schedule');
  expect(result).toBe(false);
});

test('router ignores price list registration when controller missing', () => {
  router.registerPriceListRoutes();
  const result = router.navigate('price-list');
  expect(result).toBe(false);
});

test('router ignores schedule HTML registration when controller missing', () => {
  router.registerScheduleHtmlRoutes();
  const result = router.navigate('schedule-html');
  expect(result).toBe(false);
});

test('router ignores schedule edit registration when controller missing', () => {
  router.registerScheduleEditRoutes();
  const result = router.navigate('schedule-edit');
  expect(result).toBe(false);
});

test('router ignores author schedule registration when controller missing', () => {
  router.registerAuthorScheduleRoutes();
  const result = router.navigate('author-schedule');
  expect(result).toBe(false);
});

test('router ignores public schedule registration when controller missing', () => {
  router.registerPublicScheduleRoutes();
  const result = router.navigate('public-schedule');
  expect(result).toBe(false);
});

test('router ignores registration route when controller missing', () => {
  router.registerRegistrationRoutes();
  const result = router.navigate('registration');
  expect(result).toBe(false);
});

test('router handles schedule edit route without init or show', () => {
  const root = document.getElementById('root');
  router.setRoot(root);
  const controller = {
    view: { element: document.createElement('div') },
  };
  controller.view.element.textContent = 'Schedule Edit';
  router.registerScheduleEditRoutes({ controller });
  const result = router.navigate('schedule-edit');
  expect(result).toBe(true);
  expect(root.textContent).toContain('Schedule Edit');
});

test('router handles author schedule route without show', () => {
  const root = document.getElementById('root');
  router.setRoot(root);
  const controller = {
    view: { element: document.createElement('div') },
  };
  controller.view.element.textContent = 'Author Schedule';
  router.registerAuthorScheduleRoutes({ controller });
  const result = router.navigate('author-schedule');
  expect(result).toBe(true);
  expect(root.textContent).toContain('Author Schedule');
});

test('router handles public schedule route without show', () => {
  const root = document.getElementById('root');
  router.setRoot(root);
  const controller = {
    view: { element: document.createElement('div') },
  };
  controller.view.element.textContent = 'Public Schedule';
  router.registerPublicScheduleRoutes({ controller });
  const result = router.navigate('public-schedule');
  expect(result).toBe(true);
  expect(root.textContent).toContain('Public Schedule');
});

test('router renders empty public schedule view when view missing', () => {
  const root = document.getElementById('root');
  router.setRoot(root);
  const controller = {
    view: null,
    show: jest.fn(),
  };
  router.registerPublicScheduleRoutes({ controller });
  const result = router.navigate('public-schedule', { conferenceId: 'conf_none' });
  expect(result).toBe(true);
  expect(root.textContent).toBe('');
  expect(controller.show).toHaveBeenCalledWith('conf_none');
});

test('router renders empty registration view when view missing', () => {
  const root = document.getElementById('root');
  router.setRoot(root);
  const controller = {
    view: null,
    init: jest.fn(),
    show: jest.fn(),
  };
  router.registerRegistrationRoutes({ controller });
  const result = router.navigate('registration');
  expect(result).toBe(true);
  expect(root.textContent).toBe('');
  expect(controller.init).toHaveBeenCalled();
  expect(controller.show).toHaveBeenCalled();
});

test('router handles registration route without init or show', () => {
  const root = document.getElementById('root');
  router.setRoot(root);
  const controller = {
    view: { element: document.createElement('div') },
  };
  controller.view.element.textContent = 'Registration';
  router.registerRegistrationRoutes({ controller });
  const result = router.navigate('registration');
  expect(result).toBe(true);
  expect(root.textContent).toContain('Registration');
});

test('router passes null conferenceId for author schedule when payload missing', () => {
  const root = document.getElementById('root');
  router.setRoot(root);
  const controller = {
    view: { element: document.createElement('div') },
    show: jest.fn(),
  };
  controller.view.element.textContent = 'Author Schedule';
  router.registerAuthorScheduleRoutes({ controller });
  const result = router.navigate('author-schedule');
  expect(result).toBe(true);
  expect(controller.show).toHaveBeenCalledWith(null);
});

test('router renders empty author schedule view when view missing', () => {
  const root = document.getElementById('root');
  router.setRoot(root);
  const controller = {
    view: null,
    show: jest.fn(),
  };
  router.registerAuthorScheduleRoutes({ controller });
  const result = router.navigate('author-schedule', { conferenceId: 'conf_none' });
  expect(result).toBe(true);
  expect(root.textContent).toBe('');
  expect(controller.show).toHaveBeenCalledWith('conf_none');
});

test('router passes null conferenceId for public schedule when payload missing', () => {
  const root = document.getElementById('root');
  router.setRoot(root);
  const controller = {
    view: { element: document.createElement('div') },
    show: jest.fn(),
  };
  controller.view.element.textContent = 'Public Schedule';
  router.registerPublicScheduleRoutes({ controller });
  const result = router.navigate('public-schedule');
  expect(result).toBe(true);
  expect(controller.show).toHaveBeenCalledWith(null);
});

test('router passes null conferenceId for schedule edit when payload missing', () => {
  const root = document.getElementById('root');
  router.setRoot(root);
  const controller = {
    view: { element: document.createElement('div') },
    show: jest.fn(),
  };
  controller.view.element.textContent = 'Schedule Edit';
  router.registerScheduleEditRoutes({ controller });
  const result = router.navigate('schedule-edit');
  expect(result).toBe(true);
  expect(controller.show).toHaveBeenCalledWith(null);
});

test('router renders empty schedule edit view when view missing', () => {
  const root = document.getElementById('root');
  router.setRoot(root);
  const controller = {
    view: null,
    show: jest.fn(),
  };
  router.registerScheduleEditRoutes({ controller });
  const result = router.navigate('schedule-edit', { conferenceId: 'conf_none' });
  expect(result).toBe(true);
  expect(root.textContent).toBe('');
  expect(controller.show).toHaveBeenCalledWith('conf_none');
});

test('router renders empty content when schedule HTML view missing', () => {
  const root = document.getElementById('root');
  router.setRoot(root);
  const controller = {
    view: null,
    show: jest.fn(),
  };
  router.registerScheduleHtmlRoutes({ controller });
  const result = router.navigate('schedule-html', { conferenceId: 'conf_none' });
  expect(result).toBe(true);
  expect(root.textContent).toBe('');
  expect(controller.show).toHaveBeenCalledWith('conf_none');
});
