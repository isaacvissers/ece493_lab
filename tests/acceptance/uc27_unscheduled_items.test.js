import { createScheduleHtmlView } from '../../src/views/schedule_html_view.js';
import { createScheduleHtmlController } from '../../src/controllers/schedule_html_controller.js';
import { sessionState } from '../../src/models/session-state.js';

beforeEach(() => {
  sessionState.clear();
  document.body.innerHTML = '';
});

test('renders unscheduled section for incomplete items', () => {
  const scheduleService = {
    getPublishedSchedule: () => ({
      schedule: { scheduleId: 'sched_unsched', status: 'published' },
      items: [
        { paperTitle: 'Paper A', status: 'unscheduled' },
      ],
    }),
  };
  sessionState.authenticate({ id: 'acct_editor', role: 'Editor' });
  const view = createScheduleHtmlView();
  document.body.appendChild(view.element);
  const controller = createScheduleHtmlController({ view, sessionState, scheduleService });
  controller.show('conf_unsched');
  expect(view.element.textContent).toContain('Unscheduled');
  expect(view.element.textContent).toContain('Paper A');
});
