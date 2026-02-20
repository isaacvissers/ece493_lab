import { createAuthorScheduleView } from '../../src/views/author_schedule_view.js';
import { createAuthorScheduleController } from '../../src/controllers/author_schedule_controller.js';
import { scheduleRepository } from '../../src/services/schedule_repository.js';
import { scheduleService } from '../../src/services/schedule_service.js';
import { notificationService } from '../../src/services/notification_service.js';
import { sessionState } from '../../src/models/session-state.js';

beforeEach(() => {
  scheduleRepository.reset();
  notificationService.reset();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('publication failure keeps schedule unavailable and suppresses notifications', () => {
  scheduleRepository.savePapers([
    {
      paperId: 'paper_fail',
      status: 'accepted',
      authorIds: ['author_fail'],
      authorEmailMap: { author_fail: 'author_fail@example.com' },
      conferenceId: 'conf_fail',
    },
  ]);
  scheduleRepository.saveDraft({
    conferenceId: 'conf_fail',
    items: [
      {
        entryId: 'entry_fail',
        paperId: 'paper_fail',
        roomId: 'Room F',
        startTime: '2026-06-15T09:00:00.000Z',
        endTime: '2026-06-15T09:30:00.000Z',
        status: 'scheduled',
      },
    ],
  });

  scheduleRepository.setFailureMode(true);
  try {
    scheduleRepository.publishSchedule({ conferenceId: 'conf_fail' });
  } catch (error) {
    // expected
  }
  scheduleRepository.setFailureMode(false);

  const schedule = scheduleRepository.getSchedule('conf_fail');
  const notificationResult = notificationService.sendFinalScheduleNotifications({
    schedule,
    papers: scheduleRepository.getAcceptedPapers('conf_fail'),
  });

  expect(notificationResult.ok).toBe(false);
  expect(notificationService.getNotifications()).toHaveLength(0);

  sessionState.authenticate({ id: 'author_fail', email: 'author_fail@example.com' });
  const view = createAuthorScheduleView();
  document.body.appendChild(view.element);
  const controller = createAuthorScheduleController({ view, sessionState, scheduleService });
  controller.show('conf_fail');

  expect(view.element.textContent).toContain('Schedule not available yet');
});
