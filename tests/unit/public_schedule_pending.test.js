import { publicScheduleService } from '../../src/services/public_schedule_service.js';
import { scheduleRepository } from '../../src/services/schedule_repository.js';

beforeEach(() => {
  scheduleRepository.reset();
});

test('returns not_published when schedule is draft', () => {
  scheduleRepository.saveDraft({
    conferenceId: 'conf_pending',
    items: [],
  });
  const result = publicScheduleService.getPublicSchedule({ conferenceId: 'conf_pending' });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('not_published');
});
