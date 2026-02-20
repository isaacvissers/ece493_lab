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

test('renders published schedule details for an author', () => {
  scheduleRepository.savePapers([
    {
      paperId: 'paper_author',
      title: 'Author Paper',
      status: 'accepted',
      authorIds: ['author_a'],
      conferenceId: 'conf_author',
    },
  ]);
  scheduleRepository.saveDraft({
    conferenceId: 'conf_author',
    items: [
      {
        entryId: 'entry_author',
        paperId: 'paper_author',
        roomId: 'Room B',
        startTime: '2026-06-11T11:00:00.000Z',
        endTime: '2026-06-11T11:30:00.000Z',
        status: 'scheduled',
      },
    ],
  });
  scheduleRepository.publishSchedule({ conferenceId: 'conf_author' });

  sessionState.authenticate({ id: 'author_a', email: 'author_a@example.com' });
  const view = createAuthorScheduleView();
  document.body.appendChild(view.element);
  const controller = createAuthorScheduleController({ view, sessionState, scheduleService });
  controller.show('conf_author');

  expect(view.element.textContent).toContain('Room B');
  expect(view.element.textContent).toContain('Author Paper');
});
