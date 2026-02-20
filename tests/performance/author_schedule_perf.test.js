import { createAuthorScheduleView } from '../../src/views/author_schedule_view.js';
import { createAuthorScheduleController } from '../../src/controllers/author_schedule_controller.js';
import { scheduleRepository } from '../../src/services/schedule_repository.js';
import { scheduleService } from '../../src/services/schedule_service.js';
import { sessionState } from '../../src/models/session-state.js';

beforeEach(() => {
  scheduleRepository.reset();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('author schedule view responds within 200 ms', () => {
  const papers = [];
  const items = [];
  for (let i = 0; i < 50; i += 1) {
    papers.push({
      paperId: `paper_${i}`,
      status: 'accepted',
      authorIds: ['author_perf'],
      conferenceId: 'conf_perf',
    });
    items.push({
      entryId: `entry_${i}`,
      paperId: `paper_${i}`,
      roomId: `Room ${i % 5}`,
      startTime: `2026-06-20T${String(9 + (i % 6)).padStart(2, '0')}:00:00.000Z`,
      endTime: `2026-06-20T${String(9 + (i % 6)).padStart(2, '0')}:30:00.000Z`,
      status: 'scheduled',
    });
  }
  scheduleRepository.savePapers(papers);
  scheduleRepository.saveDraft({ conferenceId: 'conf_perf', items });
  scheduleRepository.publishSchedule({ conferenceId: 'conf_perf' });

  sessionState.authenticate({ id: 'author_perf', email: 'perf@example.com' });
  const view = createAuthorScheduleView();
  document.body.appendChild(view.element);
  const controller = createAuthorScheduleController({ view, sessionState, scheduleService });

  const start = Date.now();
  controller.show('conf_perf');
  const elapsed = Date.now() - start;
  expect(elapsed).toBeLessThan(200);
});
