import { createScheduleDraftView } from '../../src/views/schedule_draft_view.js';
import { createScheduleController } from '../../src/controllers/schedule_controller.js';
import { createPublicScheduleView } from '../../src/views/public_schedule_view.js';
import { createPublicScheduleController } from '../../src/controllers/public_schedule_controller.js';
import { scheduleRepository } from '../../src/services/schedule_repository.js';
import { publicationLogService } from '../../src/services/publication_log_service.js';
import { sessionState } from '../../src/models/session-state.js';

beforeEach(() => {
  scheduleRepository.reset();
  publicationLogService.reset();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('publish failure keeps public schedule unavailable', () => {
  scheduleRepository.saveDraft({
    conferenceId: 'conf_publish_fail',
    items: [],
  });
  scheduleRepository.saveSchedule({ conferenceId: 'conf_publish_fail' });
  sessionState.authenticate({ id: 'acct_admin', role: 'Admin' });
  const scheduleView = createScheduleDraftView();
  document.body.appendChild(scheduleView.element);
  scheduleView.element.querySelector('#conferenceId').value = 'conf_publish_fail';
  const scheduleController = createScheduleController({ view: scheduleView, sessionState });
  scheduleController.init();
  scheduleRepository.setFailureMode(true);
  scheduleView.element.querySelector('#schedule-publish').click();
  scheduleRepository.setFailureMode(false);

  const publicView = createPublicScheduleView();
  document.body.appendChild(publicView.element);
  const publicController = createPublicScheduleController({ view: publicView });
  publicController.show('conf_publish_fail');
  expect(publicView.element.textContent).toContain('Schedule not available yet.');
  expect(publicationLogService.getLogs().length).toBeGreaterThan(0);
});
