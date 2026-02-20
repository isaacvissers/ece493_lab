import { createScheduleHtmlView } from '../../src/views/schedule_html_view.js';
import { createScheduleHtmlController } from '../../src/controllers/schedule_html_controller.js';
import { sessionState } from '../../src/models/session-state.js';

function setup(scheduleService) {
  const view = createScheduleHtmlView();
  document.body.appendChild(view.element);
  const controller = createScheduleHtmlController({ view, sessionState, scheduleService });
  return { view, controller };
}

beforeEach(() => {
  sessionState.clear();
  document.body.innerHTML = '';
});

test('renders schedule HTML when schedule exists', () => {
  const scheduleService = {
    getPublishedSchedule: () => ({
      schedule: { scheduleId: 'sched_1', status: 'published' },
      items: [
        {
          paperTitle: 'Paper 1',
          roomName: 'Room A',
          startTime: '2026-05-01T09:00:00.000Z',
          endTime: '2026-05-01T09:30:00.000Z',
          status: 'scheduled',
        },
      ],
    }),
  };
  sessionState.authenticate({ id: 'acct_admin', role: 'Admin' });
  const { view, controller } = setup(scheduleService);
  controller.show('conf_1');
  expect(view.element.textContent).toContain('Paper 1');
});

test('includes time and room assignments for scheduled items', () => {
  const scheduleService = {
    getPublishedSchedule: () => ({
      schedule: { scheduleId: 'sched_1', status: 'published' },
      items: [
        {
          paperTitle: 'Paper 2',
          roomName: 'Room B',
          startTime: '2026-05-01T10:00:00.000Z',
          endTime: '2026-05-01T10:30:00.000Z',
          status: 'scheduled',
        },
      ],
    }),
  };
  sessionState.authenticate({ id: 'acct_editor', role: 'Editor' });
  const { view, controller } = setup(scheduleService);
  controller.show('conf_2');
  expect(view.element.textContent).toContain('Room B');
  expect(view.element.textContent).toContain('2026-05-01T10:00:00.000Z');
});
