import { scheduleRepository } from './schedule_repository.js';

export const scheduleService = {
  getPublishedSchedule(conferenceId) {
    const schedule = scheduleRepository.getSchedule(conferenceId);
    if (!schedule || schedule.status !== 'published') {
      return null;
    }
    const items = scheduleRepository.getScheduleItems(schedule.scheduleId);
    return { schedule, items };
  },
};
