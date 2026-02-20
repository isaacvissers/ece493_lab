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

test('renders published schedule using schedule service', () => {
  const draft = scheduleRepository.saveDraft({
    conferenceId: 'conf_html',
    items: [
      {
        paperTitle: 'Paper HTML',
        roomName: 'Room A',
        startTime: '2026-05-01T09:00:00.000Z',
        endTime: '2026-05-01T09:30:00.000Z',
        status: 'scheduled',
      },
    ],
  });
  scheduleRepository.publishSchedule({ conferenceId: draft.conferenceId });
  sessionState.authenticate({ id: 'acct_admin', role: 'Admin' });
  const view = createScheduleHtmlView();
  document.body.appendChild(view.element);
  const controller = createScheduleHtmlController({ view, sessionState, scheduleService });
  controller.show('conf_html');
  expect(view.element.textContent).toContain('Paper HTML');
});
