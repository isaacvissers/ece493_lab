import { createScheduleHtmlView } from '../../src/views/schedule_html_view.js';
import { createScheduleHtmlController } from '../../src/controllers/schedule_html_controller.js';
import { sessionState } from '../../src/models/session-state.js';

beforeEach(() => {
  sessionState.clear();
  document.body.innerHTML = '';
});

test('shows no schedule available when schedule missing', () => {
  const scheduleService = { getPublishedSchedule: () => null };
  sessionState.authenticate({ id: 'acct_admin', role: 'Admin' });
  const view = createScheduleHtmlView();
  document.body.appendChild(view.element);
  const controller = createScheduleHtmlController({ view, sessionState, scheduleService });
  controller.show('conf_missing');
  expect(view.element.textContent).toContain('No schedule available');
});
