import { createAuthorScheduleView } from '../../src/views/author_schedule_view.js';
import { createAuthorScheduleController } from '../../src/controllers/author_schedule_controller.js';
import { scheduleRepository } from '../../src/services/schedule_repository.js';
import { scheduleService } from '../../src/services/schedule_service.js';
import { auditLogService } from '../../src/services/audit_log_service.js';
import { sessionState } from '../../src/models/session-state.js';

beforeEach(() => {
  scheduleRepository.reset();
  auditLogService.reset();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('denies access for non-associated authors and logs attempt', () => {
  scheduleRepository.savePapers([
    { paperId: 'paper_access', status: 'accepted', authorIds: ['author_real'], conferenceId: 'conf_access' },
  ]);
  scheduleRepository.saveDraft({ conferenceId: 'conf_access', items: [] });
  scheduleRepository.publishSchedule({ conferenceId: 'conf_access' });

  sessionState.authenticate({ id: 'author_fake', email: 'fake@example.com' });
  const view = createAuthorScheduleView();
  document.body.appendChild(view.element);
  const controller = createAuthorScheduleController({ view, sessionState, scheduleService });
  controller.show('conf_access');

  expect(view.element.textContent).toContain('Access denied');
  const logs = auditLogService.getLogs();
  expect(logs.some((log) => log.eventType === 'schedule_access_denied')).toBe(true);
});
