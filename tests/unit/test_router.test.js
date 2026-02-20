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
