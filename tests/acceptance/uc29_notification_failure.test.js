import { createAuthorScheduleView } from '../../src/views/author_schedule_view.js';
import { createAuthorScheduleController } from '../../src/controllers/author_schedule_controller.js';
import { scheduleRepository } from '../../src/services/schedule_repository.js';
import { scheduleService } from '../../src/services/schedule_service.js';
import { notificationService } from '../../src/services/notification_service.js';
import { auditLogService } from '../../src/services/audit_log_service.js';
import { sessionState } from '../../src/models/session-state.js';

beforeEach(() => {
  scheduleRepository.reset();
  notificationService.reset();
  auditLogService.reset();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('notification failure does not block in-app schedule access', () => {
  scheduleRepository.savePapers([
    {
      paperId: 'paper_notice_fail',
      title: 'Notice Paper',
      status: 'accepted',
      authorIds: ['author_notice'],
      authorEmailMap: { author_notice: 'notice@example.com' },
      conferenceId: 'conf_notice_fail',
    },
  ]);
  scheduleRepository.saveDraft({
    conferenceId: 'conf_notice_fail',
    items: [
      {
        entryId: 'entry_notice',
        paperId: 'paper_notice_fail',
        roomId: 'Room N',
        startTime: '2026-06-16T10:00:00.000Z',
        endTime: '2026-06-16T10:30:00.000Z',
        status: 'scheduled',
      },
    ],
  });
  const schedule = scheduleRepository.publishSchedule({ conferenceId: 'conf_notice_fail' });

  notificationService.setFailureMode({ email: true, inApp: true });
  const notificationResult = notificationService.sendFinalScheduleNotifications({
    schedule,
    papers: scheduleRepository.getAcceptedPapers('conf_notice_fail'),
    auditLogService,
  });
  expect(notificationResult.ok).toBe(false);
  expect(auditLogService.getLogs().some((log) => log.eventType === 'schedule_notification_failed')).toBe(true);

  sessionState.authenticate({ id: 'author_notice', email: 'notice@example.com' });
  const view = createAuthorScheduleView();
  document.body.appendChild(view.element);
  const controller = createAuthorScheduleController({ view, sessionState, scheduleService });
  controller.show('conf_notice_fail');

  expect(view.element.textContent).toContain('Room N');
  expect(view.element.textContent).toContain('Notice Paper');
});
