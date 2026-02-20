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

test('publication failure blocks schedule details and notifications', () => {
  scheduleRepository.savePapers([
    {
      paperId: 'paper_blocked',
      status: 'accepted',
      authorIds: ['author_blocked'],
      authorEmailMap: { author_blocked: 'blocked@example.com' },
      conferenceId: 'conf_blocked',
    },
  ]);
  scheduleRepository.saveDraft({
    conferenceId: 'conf_blocked',
    items: [
      {
        entryId: 'entry_blocked',
        paperId: 'paper_blocked',
        roomId: 'Room B',
        startTime: '2026-06-18T10:00:00.000Z',
        endTime: '2026-06-18T10:30:00.000Z',
        status: 'scheduled',
      },
    ],
  });

  scheduleRepository.setFailureMode(true);
  try {
    scheduleRepository.publishSchedule({ conferenceId: 'conf_blocked' });
  } catch (error) {
    // expected
  }
  scheduleRepository.setFailureMode(false);

  const schedule = scheduleRepository.getSchedule('conf_blocked');
  const notificationResult = notificationService.sendFinalScheduleNotifications({
    schedule,
    papers: scheduleRepository.getAcceptedPapers('conf_blocked'),
  });
  expect(notificationResult.ok).toBe(false);
  expect(notificationService.getNotifications()).toHaveLength(0);

  sessionState.authenticate({ id: 'author_blocked', email: 'blocked@example.com' });
  const view = createAuthorScheduleView();
  document.body.appendChild(view.element);
  const controller = createAuthorScheduleController({ view, sessionState, scheduleService });
  controller.show('conf_blocked');
  expect(view.element.textContent).toContain('Schedule not available yet');
});
