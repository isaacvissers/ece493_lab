import { jest } from '@jest/globals';
import { createPublicScheduleView } from '../../src/views/public_schedule_view.js';
import { createPublicScheduleController } from '../../src/controllers/public_schedule_controller.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('logs render failure with conference id', () => {
  const view = createPublicScheduleView();
  document.body.appendChild(view.element);
  view.renderSchedule = () => {
    throw new Error('render_boom');
  };
  const publicScheduleService = {
    getPublicSchedule: () => ({
      ok: true,
      entries: [],
      unscheduled: [],
      lastUpdatedAt: null,
      schedule: { id: 'sched_render' },
    }),
  };
  const publicationLogService = { logFailure: jest.fn() };
  const controller = createPublicScheduleController({
    view,
    publicScheduleService,
    publicationLogService,
  });
  controller.show('conf_render');
  expect(publicationLogService.logFailure).toHaveBeenCalledWith(expect.objectContaining({
    context: 'render',
    errorMessage: 'render_boom',
    relatedId: 'conf_render',
  }));
});

test('uses schedule id when conference id missing', () => {
  const view = createPublicScheduleView();
  document.body.appendChild(view.element);
  view.renderSchedule = () => {
    throw {};
  };
  const publicScheduleService = {
    getPublicSchedule: () => ({
      ok: true,
      entries: [],
      unscheduled: [],
      lastUpdatedAt: null,
      schedule: { id: 'sched_only' },
    }),
  };
  const publicationLogService = { logFailure: jest.fn() };
  const controller = createPublicScheduleController({
    view,
    publicScheduleService,
    publicationLogService,
  });
  controller.show();
  expect(publicationLogService.logFailure).toHaveBeenCalledWith(expect.objectContaining({
    context: 'render',
    errorMessage: 'render_failed',
    relatedId: 'sched_only',
  }));
});

test('uses fallback relatedId on timeout when schedule missing', () => {
  const view = createPublicScheduleView();
  document.body.appendChild(view.element);
  const publicScheduleService = {
    getPublicSchedule: () => ({
      ok: true,
      entries: [],
      unscheduled: [],
      lastUpdatedAt: null,
      schedule: null,
    }),
  };
  let callCount = 0;
  const performanceService = {
    now: () => {
      callCount += 1;
      return callCount === 1 ? 0 : 5000;
    },
  };
  const publicationLogService = { logFailure: jest.fn() };
  const controller = createPublicScheduleController({
    view,
    publicScheduleService,
    publicationLogService,
    performanceService,
    timeoutMs: 1000,
  });
  controller.show();
  expect(publicationLogService.logFailure).toHaveBeenCalledWith(expect.objectContaining({
    context: 'render_timeout',
    relatedId: 'public_schedule',
  }));
});

test('uses public_schedule relatedId when render fails without schedule', () => {
  const view = createPublicScheduleView();
  document.body.appendChild(view.element);
  view.renderSchedule = () => {
    throw new Error('fail');
  };
  const publicScheduleService = {
    getPublicSchedule: () => ({
      ok: true,
      entries: [],
      unscheduled: [],
      lastUpdatedAt: null,
      schedule: null,
    }),
  };
  const publicationLogService = { logFailure: jest.fn() };
  const controller = createPublicScheduleController({
    view,
    publicScheduleService,
    publicationLogService,
  });
  controller.show();
  expect(publicationLogService.logFailure).toHaveBeenCalledWith(expect.objectContaining({
    relatedId: 'public_schedule',
  }));
});

test('uses schedule id for timeout when available', () => {
  const view = createPublicScheduleView();
  document.body.appendChild(view.element);
  const publicScheduleService = {
    getPublicSchedule: () => ({
      ok: true,
      entries: [],
      unscheduled: [],
      lastUpdatedAt: null,
      schedule: { id: 'sched_timeout' },
    }),
  };
  let callCount = 0;
  const performanceService = {
    now: () => {
      callCount += 1;
      return callCount === 1 ? 0 : 5000;
    },
  };
  const publicationLogService = { logFailure: jest.fn() };
  const controller = createPublicScheduleController({
    view,
    publicScheduleService,
    publicationLogService,
    performanceService,
    timeoutMs: 1000,
  });
  controller.show();
  expect(publicationLogService.logFailure).toHaveBeenCalledWith(expect.objectContaining({
    context: 'render_timeout',
    relatedId: 'sched_timeout',
  }));
});
