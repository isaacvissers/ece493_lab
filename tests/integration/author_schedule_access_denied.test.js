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

test('denies access for unrelated author and logs', () => {
  scheduleRepository.savePapers([
    { paperId: 'paper_denied', status: 'accepted', authorIds: ['author_good'], conferenceId: 'conf_denied' },
  ]);
  scheduleRepository.saveDraft({ conferenceId: 'conf_denied', items: [] });
  scheduleRepository.publishSchedule({ conferenceId: 'conf_denied' });

  sessionState.authenticate({ id: 'author_bad', email: 'bad@example.com' });
  const view = createAuthorScheduleView();
  document.body.appendChild(view.element);
  const controller = createAuthorScheduleController({ view, sessionState, scheduleService });
  controller.show('conf_denied');

  expect(view.element.textContent).toContain('Access denied');
  expect(auditLogService.getLogs().some((log) => log.eventType === 'schedule_access_denied')).toBe(true);
});
