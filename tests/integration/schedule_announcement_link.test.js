import { createScheduleAnnouncementView } from '../../src/views/schedule_announcement_view.js';
import { announcementService } from '../../src/services/announcement_service.js';
import { scheduleRepository } from '../../src/services/schedule_repository.js';

beforeEach(() => {
  scheduleRepository.reset();
  document.body.innerHTML = '';
});

test('announcement view renders schedule link when published', () => {
  scheduleRepository.saveDraft({
    conferenceId: 'conf_announce',
    items: [],
  });
  scheduleRepository.publishSchedule({ conferenceId: 'conf_announce' });
  const result = announcementService.getAnnouncement({ conferenceId: 'conf_announce' });
  const view = createScheduleAnnouncementView();
  document.body.appendChild(view.element);
  if (result.ok) {
    view.setAnnouncement({
      titleText: result.announcement.title,
      summaryText: result.announcement.summary,
      scheduleLink: result.announcement.scheduleLink,
      lastUpdatedAt: result.announcement.lastUpdatedAt,
    });
  }
  const link = view.element.querySelector('a');
  expect(link).toBeTruthy();
  expect(link.getAttribute('href')).toBe('/public/schedule');
});
