import { scheduleRepository } from '../../src/services/schedule_repository.js';
import { scheduleService } from '../../src/services/schedule_service.js';

beforeEach(() => {
  scheduleRepository.reset();
});

test('schedule retrieval completes within 1 second for 300 accepted papers', () => {
  const papers = [];
  const items = [];
  for (let i = 0; i < 300; i += 1) {
    papers.push({
      paperId: `paper_${i}`,
      status: 'accepted',
      authorIds: ['author_bulk'],
      conferenceId: 'conf_bulk',
    });
    items.push({
      entryId: `entry_${i}`,
      paperId: `paper_${i}`,
      roomId: `Room ${i % 10}`,
      startTime: `2026-06-21T${String(9 + (i % 6)).padStart(2, '0')}:00:00.000Z`,
      endTime: `2026-06-21T${String(9 + (i % 6)).padStart(2, '0')}:30:00.000Z`,
      status: 'scheduled',
    });
  }
  scheduleRepository.savePapers(papers);
  scheduleRepository.saveDraft({ conferenceId: 'conf_bulk', items });
  scheduleRepository.publishSchedule({ conferenceId: 'conf_bulk' });

  const start = Date.now();
  const result = scheduleService.getPublishedScheduleForAuthor({
    conferenceId: 'conf_bulk',
    authorId: 'author_bulk',
  });
  const elapsed = Date.now() - start;
  expect(result.ok).toBe(true);
  expect(elapsed).toBeLessThan(1000);
});
