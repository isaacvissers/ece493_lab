import { createScheduleHtmlView } from '../../src/views/schedule_html_view.js';
import { createScheduleHtmlController } from '../../src/controllers/schedule_html_controller.js';
import { scheduleRepository } from '../../src/services/schedule_repository.js';
import { scheduleService } from '../../src/services/schedule_service.js';
import { sessionState } from '../../src/models/session-state.js';

beforeEach(() => {
  scheduleRepository.reset();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('returns no schedule available message when none published', () => {
  sessionState.authenticate({ id: 'acct_admin', role: 'Admin' });
  const view = createScheduleHtmlView();
  document.body.appendChild(view.element);
  const controller = createScheduleHtmlController({ view, sessionState, scheduleService });
  controller.show('conf_none');
  expect(view.element.textContent).toContain('No schedule available');
});
