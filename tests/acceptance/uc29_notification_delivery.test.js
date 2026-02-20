import { scheduleRepository } from '../../src/services/schedule_repository.js';
import { notificationService } from '../../src/services/notification_service.js';

beforeEach(() => {
  scheduleRepository.reset();
  notificationService.reset();
});

test('schedule publication triggers email and in-app notifications', () => {
  scheduleRepository.savePapers([
    {
      paperId: 'paper_notice',
      status: 'accepted',
      authorIds: ['author_notice'],
      authorEmailMap: { author_notice: 'author@example.com' },
      conferenceId: 'conf_notice',
    },
  ]);
  scheduleRepository.saveDraft({
    conferenceId: 'conf_notice',
    items: [
      {
        entryId: 'entry_notice',
        paperId: 'paper_notice',
        roomId: 'Room A',
        startTime: '2026-06-10T10:00:00.000Z',
        endTime: '2026-06-10T10:30:00.000Z',
        status: 'scheduled',
      },
    ],
  });
  const schedule = scheduleRepository.publishSchedule({ conferenceId: 'conf_notice' });

  const result = notificationService.sendFinalScheduleNotifications({
    schedule,
    papers: scheduleRepository.getAcceptedPapers('conf_notice'),
  });

  expect(result.ok).toBe(true);
  const notifications = notificationService.getNotifications();
  const delivery = notifications.filter((note) => note.paperId === 'paper_notice');
  const channels = delivery.map((note) => note.channel).sort();
  expect(channels).toEqual(['email', 'in_app']);
});
