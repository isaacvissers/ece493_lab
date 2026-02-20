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

test('accepted author sees time and room after schedule publish', () => {
  scheduleRepository.savePapers([
    {
      paperId: 'paper_1',
      title: 'Paper One',
      status: 'accepted',
      authorIds: ['author_1'],
      conferenceId: 'conf_1',
    },
  ]);
  scheduleRepository.saveDraft({
    conferenceId: 'conf_1',
    items: [
      {
        entryId: 'entry_1',
        paperId: 'paper_1',
        roomId: 'Room A',
        startTime: '2026-06-01T09:00:00.000Z',
        endTime: '2026-06-01T09:30:00.000Z',
        status: 'scheduled',
      },
    ],
  });
  scheduleRepository.publishSchedule({ conferenceId: 'conf_1' });

  sessionState.authenticate({ id: 'author_1', email: 'author@example.com' });
  const view = createAuthorScheduleView();
  document.body.appendChild(view.element);
  const controller = createAuthorScheduleController({ view, sessionState, scheduleService });
  controller.show('conf_1');

  expect(view.element.textContent).toContain('Room A');
  expect(view.element.textContent).toContain('2026-06-01T09:00:00.000Z');
  expect(view.element.textContent).toContain('Paper One');
});
