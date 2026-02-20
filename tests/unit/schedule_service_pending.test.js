import { scheduleRepository } from '../../src/services/schedule_repository.js';
import { scheduleService } from '../../src/services/schedule_service.js';

beforeEach(() => {
  scheduleRepository.reset();
});

test('returns not_published when schedule missing', () => {
  scheduleRepository.savePapers([
    { paperId: 'paper_np', status: 'accepted', authorIds: ['author_np'], conferenceId: 'conf_np' },
  ]);
  const result = scheduleService.getPublishedScheduleForAuthor({
    conferenceId: 'conf_np',
    authorId: 'author_np',
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('not_published');
});

test('returns access_denied when called without args', () => {
  const result = scheduleService.getPublishedScheduleForAuthor();
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('missing_author');
});
