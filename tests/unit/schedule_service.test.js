import { scheduleService } from '../../src/services/schedule_service.js';
import { scheduleRepository } from '../../src/services/schedule_repository.js';

beforeEach(() => {
  scheduleRepository.reset();
});

test('returns published schedule with items only', () => {
  const draft = scheduleRepository.saveDraft({
    conferenceId: 'conf_pub',
    items: [{ paperTitle: 'Paper A', status: 'scheduled' }],
  });
  scheduleRepository.publishSchedule({ conferenceId: draft.conferenceId });
  const result = scheduleService.getPublishedSchedule('conf_pub');
  expect(result.schedule.status).toBe('published');
  expect(result.items.length).toBe(1);
});

test('returns null when schedule missing or not published', () => {
  expect(scheduleService.getPublishedSchedule('conf_none')).toBeNull();
  const draft = scheduleRepository.saveDraft({ conferenceId: 'conf_draft', items: [] });
  const result = scheduleService.getPublishedSchedule(draft.conferenceId);
  expect(result).toBeNull();
});
