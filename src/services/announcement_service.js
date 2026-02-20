import { createAnnouncement } from '../models/announcement.js';
import { scheduleRepository as defaultScheduleRepository } from './schedule_repository.js';

export const announcementService = {
  getAnnouncement({
    conferenceId,
    scheduleRepository = defaultScheduleRepository,
    scheduleLink = '/public/schedule',
    now = new Date().toISOString(),
  } = {}) {
    const schedule = scheduleRepository.getSchedule(conferenceId);
    if (!schedule || schedule.status !== 'published') {
      return { ok: false, reason: 'not_published' };
    }
    const lastUpdatedAt = schedule.updatedAt || schedule.publishedAt || now;
    return {
      ok: true,
      announcement: createAnnouncement({
        title: 'Final schedule published',
        summary: 'The final conference schedule is now available.',
        scheduleLink,
        lastUpdatedAt,
      }),
    };
  },
};
